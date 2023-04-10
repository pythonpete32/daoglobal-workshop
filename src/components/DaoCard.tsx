import React from "react";
import { Card, Skeleton } from "@components/common";
import { useFetchDao } from "@daobox/use-aragon";
import { Flex, Metric, Text } from "@tremor/react";
import { ipfsUriToUrl } from "@utils/strings";
import { daoAddress } from "../constants";
import { Avatar, Button } from "flowbite-react";

export function DaoCard(): JSX.Element {
  const { data: dao } = useFetchDao({ daoAddressOrEns: daoAddress });

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
              <Button>Deposit Eth</Button>
              <Button>Mint Token</Button>
            </div>
          </Flex>
        </Card>
      )}
    </Skeleton>
  );
}
