
'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface WalletInfo {
    privateKey: string;
	mnemonic: string;
    address: string;
}

export default function Home() {

	const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

	const createWallet = async () => {
		const randomWallet = ethers.Wallet.createRandom();
		const walletData = {
			privateKey: randomWallet.privateKey,
			mnemonic: randomWallet.mnemonic.phrase,
			address: randomWallet.address,
		};
		setWalletInfo(walletData);
		return walletData;
	};

	return (
		<main className="flex min-h-screen p-24">
			<div className="z-10 w-full font-mono text-sm lg:flex">
				{walletInfo && (
					<div>
						<div className="m-5">
							<div className="flex flex-col col-span-full md:col-span-6 xl:col-span-4 bg-white dark:bg-[#202123] shadow-lg rounded-3xl border border-slate-200 dark:border-slate-700">
								<div className="px-5 py-5">
									<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">6uo Wallet</h2>
									<div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">$6UO</div>
									<div className="flex items-start">
										<div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">0</div>
									</div>
									<div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
										<button onClick={() => {}} className="mr-2 hover:text-[#8ad1c2]">Deposit</button>
										<button onClick={() => {}} className="mx-2 hover:text-[#8ad1c2]">Withdraw</button>
										<button onClick={() => {}} className="ml-2 hover:text-[#8ad1c2]">Send</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
