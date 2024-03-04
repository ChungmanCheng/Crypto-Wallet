
'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletInfo {
    privateKey: string;
	mnemonic: string;
    address: string;
}

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export default function Home() {

	const [isCreateAccount, setIsCreateAccount] = useState<boolean>(false);
	const [isImportAccount, setIsImportAccount] = useState<boolean>(false);
	const [isConfirmAccount, setIsConfirmAccount] = useState<boolean>(false);
	const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [recoveryPhrase, setRecoveryPhrase] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [balance, setBalance] = useState("--");


	useEffect(() => {
		if (walletInfo && walletInfo.address) {
			const provider = new ethers.JsonRpcProvider(rpcUrl);
	
			provider.getBalance(walletInfo.address)
				.then(balance => {
					// Convert the balance to ETH
					const balanceInEth = ethers.formatEther(balance);
					console.log('Balance:', balanceInEth, 'ETH');
					console.log("Address: ", walletInfo.address);
					setBalance(balanceInEth);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		}
	}, [walletInfo]);

	const handleNext = () => {
		setCurrentPage(currentPage + 1); // Increment current page
	};

	const handleComplete = () => {
		if (recoveryPhrase === walletInfo?.mnemonic) {
			setIsConfirmAccount(true);
			setIsCreateAccount(false);
		  	setErrorMessage('');
		} else {
		  	setErrorMessage('Recovery phrase does not match.');
		}
	};

	const createWallet = async () => {
		setIsCreateAccount(true);
		setCurrentPage(1);
		const randomWallet = ethers.Wallet.createRandom();
		const walletData = {
			privateKey: randomWallet.privateKey,
			mnemonic: randomWallet.mnemonic.phrase,
			address: randomWallet.address,
		};
		setWalletInfo(walletData);
	};

	const handleImport = () => {
		try {
			const wallet = ethers.Wallet.fromPhrase(recoveryPhrase);
			setWalletInfo(wallet);
			setErrorMessage('');
			setIsImportAccount(false);
			setIsConfirmAccount(true);
		  } catch (error) {
			// If an error occurs during wallet creation, handle it appropriately
			console.log(error);
			setErrorMessage('Error importing recovery phrase. Please check and try again.');
		  }
	}

	const importWallet = async () => {
		setIsImportAccount(true);
	};

	return (
		<main className="flex min-h-screen p-24">
			<div className="z-10 w-full font-mono text-sm lg:flex">
				<div>
					<div className="m-5">
						<div className="flex flex-col col-span-full md:col-span-6 xl:col-span-4 bg-white dark:bg-[#202123] shadow-lg rounded-3xl border border-slate-200 dark:border-slate-700">
							<div className="px-5 py-5">
								<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Wallet</h2>
								<div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">ETH</div>
								{(isConfirmAccount && walletInfo)?(
									<div>
										<div className="flex items-start">
											<div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{balance}</div>
										</div>
										<div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
											<button onClick={() => {}} className="mr-2 hover:text-[#8ad1c2]">Deposit</button>
											<button onClick={() => {}} className="ml-2 hover:text-[#8ad1c2]">Send</button>
										</div>
									</div>
								):(
									<div>
										<button onClick={createWallet} className="mr-2 hover:text-[#8ad1c2]">Create Wallet</button>
										<p>or</p>
										<button onClick={importWallet} className="mr-2 hover:text-[#8ad1c2]">Import Wallet</button>
									</div>
								)}
								{isCreateAccount?(
								<div className="justify-center items-end sm:items-center m-3 sm:m-0 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
									<div className="relative sm:my-8 w-full sm:max-w-2xl">
										<div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-gray-50 dark:bg-[#202123] outline-none focus:outline-none bg-clip-padding h-[632px] sm:h-[472px]">
											{currentPage === 1 && (
											<>
												<div className="flex flex-col items-center justify-center px-5 border-solid border-gray-300 dark:border-gray-700 rounded-t h-1/6">
													<h3 className="text-2xl font-semibold dark:text-gray-200">
														Secret Recovery Phrase
													</h3>
												</div>
												<div className="relative text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400 h-3/5 flex flex-col justify-center mx-10 ml-20">                  
													<p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
														Please remember that this is your secret recovery phrase. Keep it secure and do not disclose it to anyone.
													</p>
													{walletInfo?.mnemonic}
												</div>
												<div className="flex items-center justify-center px-6 border-solid border-gray-300 dark:border-gray-700 rounded-b gap-2.5 h-1/5">
													<button
													className="w-36 bg-[#8ad1c2] text-white active:bg-teal-500 font-bold uppercase py-3 text-sm rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
													onClick={() => handleNext()}
													>
													Next
													</button>
													<button
													className="w-36 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm py-3 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
													onClick={() => setIsCreateAccount(false)}
													>
													Cancel
													</button>
												</div>
											</>
											)}
											{currentPage === 2 && (
											<>
												<div className="flex flex-col items-center justify-center px-5 border-solid border-gray-300 dark:border-gray-700 rounded-t h-1/6">
													<h3 className="text-2xl font-semibold dark:text-gray-200">
														Confirm your Secret Recovery Phrase
													</h3>
												</div>
												<div className="relative text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400 h-3/5 flex flex-col justify-center mx-10 ml-20">                  
													<input
														type="text"
														className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-200"
														placeholder="Enter your recovery phrase"
														value={recoveryPhrase}
														onChange={(e) => setRecoveryPhrase(e.target.value)}
													/>
													{errorMessage && <p className="text-red-500">{errorMessage}</p>}
												</div>
												<div className="flex items-center justify-center px-6 border-solid border-gray-300 dark:border-gray-700 rounded-b gap-2.5 h-1/5">
													<button
													className="w-36 bg-[#8ad1c2] text-white active:bg-teal-500 font-bold uppercase py-3 text-sm rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
													onClick={() => handleComplete()}
													>
													Complete
													</button>
													<button
													className="w-36 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm py-3 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
													onClick={() => setIsCreateAccount(false)}
													>
													Cancel
													</button>
												</div>
											</>
											)}
										</div>
									</div>
								</div>
								):(
								<>
								</>
								)}

								{isImportAccount?(
								<div className="justify-center items-end sm:items-center m-3 sm:m-0 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
									<div className="relative sm:my-8 w-full sm:max-w-2xl">
										<div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-gray-50 dark:bg-[#202123] outline-none focus:outline-none bg-clip-padding h-[632px] sm:h-[472px]">
											<div className="flex flex-col items-center justify-center px-5 border-solid border-gray-300 dark:border-gray-700 rounded-t h-1/6">
												<h3 className="text-2xl font-semibold dark:text-gray-200">
													Import your Secret Recovery Phrase
												</h3>
											</div>
											<div className="relative text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400 h-3/5 flex flex-col justify-center mx-10 ml-20">                  
												<input
													type="text"
													className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-200"
													placeholder="Enter your recovery phrase"
													value={recoveryPhrase}
													onChange={(e) => setRecoveryPhrase(e.target.value)}
												/>
												{errorMessage && <p className="text-red-500">{errorMessage}</p>}
											</div>
											<div className="flex items-center justify-center px-6 border-solid border-gray-300 dark:border-gray-700 rounded-b gap-2.5 h-1/5">
												<button
												className="w-36 bg-[#8ad1c2] text-white active:bg-teal-500 font-bold uppercase py-3 text-sm rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
												onClick={() => handleImport()}
												>
												Complete
												</button>
												<button
												className="w-36 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm py-3 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
												onClick={() => setIsImportAccount(false)}
												>
												Cancel
												</button>
											</div>
										</div>
									</div>
								</div>
								):(
									<>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
