import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
(async () => {
  const editionAddress = "0x8e688FCaBA0c5B6Df40c7cA51dC791604626ABbB";
  const packAddress = "0x9E74a9aC176C4c22E2aA7F8f283CFA7Dcf179689";

  try {
    const sdk = ThirdwebSDK.fromPrivateKey(
      "cacf6d8927497a2d09e99e2d8072d558afc15f63732b5ff0180a1de44fc43f19",
      "mumbai"
    );

    const edition = await sdk.getEdition(editionAddress);
    await edition.setApprovalForAll(packAddress, true);

    const lootboxFile = fs.readFileSync("./scripts/lootbox.png");

    const ipfsHash = await sdk.storage.upload(lootboxFile);
    const url = ipfsHash;
    console.log("Upload lootbox asset to IPFS");

    console.log("Creating packs now...");

    const pack = await sdk.getPack(packAddress);
    const packNfts = await pack.create({
      packMetadata: {
        name: "Coloverse Genesis Box",
        description: "A box containing Colorvese Genesis NFT",
        image: url,
      },
      erc1155Rewards: [
        {
          // Silver
          contractAddress: editionAddress,
          tokenId: 0,
          quantityPerReward: 1,
          totalRewards: 6000,
        },
        {
          // Gold
          contractAddress: editionAddress,
          tokenId: 1,
          quantityPerReward: 1,
          totalRewards: 3000,
        },
        {
          // Gold
          contractAddress: editionAddress,
          tokenId: 2,
          quantityPerReward: 1,
          totalRewards: 1000,
        },
      ],
      rewardsPerPack: 1,
    });
  } catch (error) {
    console.log(error);
  }

  console.log("Packs created!!!");
})();
