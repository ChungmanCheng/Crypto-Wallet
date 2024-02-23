
'use client';

import Image from "next/image";
import { useState } from 'react';
import { ethers } from 'ethers';

interface WalletInfo {
    privateKey: string;
    address: string;
}

export default function Home() {

	const [walletInfo, setWalletInfo] = useState<WalletInfo[] | null>(null);

	const createWallet = async () => {
		const randomWallet = ethers.Wallet.createRandom();
		const walletData = {
			privateKey: randomWallet.privateKey,
			address: randomWallet.address,
		};
		setWalletInfo(prevWalletInfo => prevWalletInfo ? [...prevWalletInfo, walletData] : [walletData]);
		return walletData;
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
				<button onClick={createWallet}>Create Wallet</button>
					{walletInfo && (
						<div>
							{walletInfo.map((wallet, index) => (
                            <div key={index} className="m-5">
                                <p>Private Key: {wallet.privateKey}</p>
                                <p>Address: {wallet.address}</p>
                            </div>
                        	))}
						</div>
					)}
			</div>
		</main>
	);
}
