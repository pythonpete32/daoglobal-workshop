import React, { useState } from "react";
import { Card, Skeleton } from "@components/common";
import { Flex, Metric, Button, Text } from "@tremor/react";
import { ipfsUriToUrl, shortenHash } from "@utils/strings";
import { Avatar } from "flowbite-react";
import {
  UseNewProposalParams,
  encodeMintToken,
  useFetchDao,
  useNewProposal,
} from "@daobox/use-aragon";
import { daoAddress, votingAddress, votingToken } from "../constants";
import { DepositModal } from "./DepositModal";
import { useDeposit } from "../hooks/useDeposit";
import { useAccount } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";

export function DaoCard(): JSX.Element {
  const { data: dao } = useFetchDao({ daoAddressOrEns: daoAddress });
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const { amount, setAmount, mutate, isProcessing, depositStatus } = useDeposit();

  const { address } = useAccount();
  const DAYS_1 = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

  const initialState: UseNewProposalParams = {
    title: "",
    summary: "",
    description: "",
    resources: [],
    actions: [],
    pluginAddress: votingAddress,
    endDate: DAYS_1,
  };
  const [voteState, setVoteState] = useState(initialState);

  const addRecentTransaction = useAddRecentTransaction();
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

  const handleMintVote = () => {
    // is the address is not avalible then do nothing
    if (!address) return;
    // encode the mint action
    const encodedMintAction = encodeMintToken({
      amount: BigInt(1e18),
      recipientAddress: address,
      tokenAddress: votingToken,
    });
    // Update the voteState with the new encodedMintAction
    setVoteState((prevState) => ({
      ...prevState,
      title: "Mint Token",
      summary: `Mint 1 Token to ${address} LIVE!!!`,
      description: `Mint 1 Token to ${address}`,
      actions: [encodedMintAction],
    }));
    console.log("voteState", voteState);
    // create the vote
    mintVote?.();
  };

  const handleDeposit = () => {
    console.log("amount", amount);
    mutate?.();
    setIsDepositModalOpen(false);
  };

  return (
    <Skeleton data={dao} animated={true} height="xs">
      {dao && (
        <Card>
          <Flex justifyContent="start" className="justify-between px-2">
            <Avatar bordered size="lg" img={ipfsUriToUrl(dao.metadata.avatar, dao.address)}>
              <div className="truncate">
                <Text>{dao.ensDomain}</Text>
                <Metric className="truncate">{dao.metadata.name}</Metric>
              </div>
            </Avatar>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setIsDepositModalOpen(true)}
                disabled={isProcessing}
                loading={isProcessing}
              >
                {isProcessing ? depositStatus : "Deposit ETH"}
              </Button>
              <Button
                onClick={() => handleMintVote()}
                disabled={isProcessingVote}
                loading={isProcessingVote}
              >
                {isProcessingVote ? proposalStatus : "Mint 1 Token"}
              </Button>
            </div>
          </Flex>
        </Card>
      )}
      <DepositModal
        onDeposit={handleDeposit}
        isOpen={isDepositModalOpen}
        setIsOpen={setIsDepositModalOpen}
        amount={amount}
        setAmount={setAmount}
      />
    </Skeleton>
  );
}
