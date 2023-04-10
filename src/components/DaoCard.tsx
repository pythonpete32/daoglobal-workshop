import React, { FormEvent, useReducer, useRef, useState } from "react";
import { Card, Skeleton } from "@components/common";
import { useFetchDao } from "@daobox/use-aragon";
import { Flex, Metric, Text, Button, Icon, TextInput } from "@tremor/react";
import { ipfsUriToUrl } from "@utils/strings";
import { daoAddress } from "../constants";
import { Avatar } from "flowbite-react";
import { useDeposit } from "../hooks/useDeposit";
import { DepositModal } from "./DepositModal";
import { useMintVote } from "../hooks/useMintVote";

export function DaoCard(): JSX.Element {
  const { data: dao } = useFetchDao({ daoAddressOrEns: daoAddress });
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const { handleMintVote, isProcessingVote, proposalStatus } = useMintVote();

  const { depositAmount, setDepositAmount, depositEth, isProcessingDeposit, depositStatus } =
    useDeposit();

  const handleDeposit = () => {
    console.log("amount", depositAmount);
    depositEth?.();
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
                disabled={isProcessingDeposit}
                loading={isProcessingDeposit}
              >
                {isProcessingDeposit ? depositStatus : "Deposit ETH"}
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
        isOpen={isDepositModalOpen}
        setIsOpen={setIsDepositModalOpen}
        amount={depositAmount}
        setAmount={setDepositAmount}
        onDeposit={handleDeposit}
      />
    </Skeleton>
  );
}
