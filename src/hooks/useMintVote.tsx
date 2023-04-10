import { useCallback, useState } from "react";
import { UseNewProposalParams, encodeMintToken, useNewProposal } from "@daobox/use-aragon";
import { shortenHash } from "@utils/strings";
import { votingAddress, votingToken } from "../constants";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { DAYS_3 } from "@utils/numbers";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export function useMintVote() {
  const addRecentTransaction = useAddRecentTransaction();
  const { address } = useAccount();

  const initialState: UseNewProposalParams = {
    title: "",
    summary: "",
    description: "",
    resources: [],
    actions: [],
    pluginAddress: votingAddress,
    endDate: DAYS_3,
  };

  const [voteState, setVoteState] = useState(initialState);
  const { mutate: mintVote, proposalStatus } = useNewProposal({
    ...voteState,
    onProposalTransaction(txHash: string) {
      toast(`Transaction Sent: ${shortenHash(txHash, 6)}`);
      addRecentTransaction({
        hash: txHash,
        description: "New Proposal",
      });
    },
    onSuccess(data) {
      toast.success(`New Vote: ${shortenHash(data.proposalTxHash!, 6)}`);
    },
    onError(error) {
      toast.error(`Proposal Error: ${error.message}`);
    },
  });

  const isProcessingVote = !["idle", "success", "error"].includes(proposalStatus);

  const handleMintVote = useCallback(() => {
    if (!address) return;
    const encodedMintAction = encodeMintToken({
      amount: BigInt(1e18),
      recipientAddress: address,
      tokenAddress: votingToken,
    });
    setVoteState((prevState) => ({
      ...prevState,
      title: "Mint Token",
      summary: `Mint 1 Token to ${address}`,
      description: `Mint 1 Token to ${address}`,
      actions: [encodedMintAction],
    }));
    mintVote?.();
  }, [address, mintVote]);

  return { handleMintVote, proposalStatus, isProcessingVote };
}
