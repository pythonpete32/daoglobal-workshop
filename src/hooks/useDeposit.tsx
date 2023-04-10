import { useState } from "react";
import { useDepositEth } from "@daobox/use-aragon";
import { shortenHash } from "@utils/strings";
import { daoAddress } from "../constants";
import toast from "react-hot-toast";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export function useDeposit() {
  const [depositAmount, setDepositAmount] = useState("");
  const addRecentTransaction = useAddRecentTransaction();

  const { mutate: depositEth, depositStatus } = useDepositEth({
    daoAddressOrEns: daoAddress,
    amount: BigInt(depositAmount),
    onTransaction(txHash) {
      toast(`Transaction Sent: ${shortenHash(txHash, 6)}`);
      addRecentTransaction({
        hash: txHash,
        description: "Deposit ETH",
      });
    },
    onSuccess(data) {
      toast.success(`Deposited: ${Number(data.deposited)}`);
    },
  });

  const isProcessingDeposit = ["waitingForSigner", "confirming"].includes(depositStatus);

  return {
    depositAmount,
    depositEth,
    setDepositAmount,
    isProcessingDeposit,
    depositStatus,
  };
}
