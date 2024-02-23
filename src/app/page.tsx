
'use client';

import Image from "next/image";
import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {

	const [walletInfo, setWalletInfo] = useState(null);

	const createWallet = async () => {
		const randomWallet = ethers.Wallet.createRandom();
		const walletData = {
			privateKey: randomWallet.privateKey,
			address: randomWallet.address,
		};
		setWalletInfo(walletData);
		return walletData;
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
				<button onClick={createWallet}>Create Wallet</button>
					{walletInfo && (
						<div>
							<p>Private Key: {walletInfo.privateKey}</p>
							<p>Address: {walletInfo.address}</p>
						</div>
					)}
			</div>
		</main>
	);
}
