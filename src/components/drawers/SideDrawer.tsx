/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import Button from '../buttons/CustomButton';
import {useState} from 'react';
import axios from 'axios';
import {apiUrl} from '../../utils/apiUrl';
import {getMessage} from '../../helpers/getMessage';
import AlertMessage from '../alerts/AlertMessage';

function SideDrawer() {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [price, setPrice] = useState<number>(0);
	const [desc, setDesc] = useState('');
	const [category, setCategory] = useState('');
	const [difficult, setDifficult] = useState('');
	const [err, setErr] = useState('');
	const [msg, setMsg] = useState('');

	const createNewGig = async () => {
		try {
			setLoading(true);
			const {data} = await axios.post(`${apiUrl}/gig/create`, {
				name,
				price,
				desc,
				category,
				difficult,
			});
			setMsg(getMessage(data));
			setErr('');
			console.log(data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErr(getMessage(error));
			setMsg('');
		}
	};
	return (
		<Sheet>
			<SheetTrigger>
				<div className="add-new bg-zinc-900  text-sm text-white  flex flex-row items-center space-x-4 rounded-lg font-medium p-2">
					<PlusCircleIcon
						height={24}
						width={24}
					/>
					<p>Add New</p>
				</div>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add a new gig</SheetTitle>
					<SheetDescription>
						Fill information below to add a new gig
					</SheetDescription>
				</SheetHeader>
				<SheetDescription>
					<div className="flex flex-col space-y-6 py-6">
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/50"
							placeholder="Enter gig name"
						/>
						<input
							type="number"
							value={price}
							onChange={(e: any) => setPrice(e.target.value)}
							className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/50"
							placeholder="price"
						/>
						<input
							type="text"
							value={difficult}
							onChange={(e) => setDifficult(e.target.value)}
							className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/50"
							placeholder="Difficult"
						/>
						<textarea
							rows={5}
							className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/50"
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
							placeholder="Description"
						/>
						<input
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="bg-zinc-50 p-2 rounded-xl border border-zinc-200/50"
							placeholder="Category"
						/>
						<div className="flex items-center justify-center w-full">
							<label
								htmlFor="dropzone-file"
								className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<svg
										className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 20 16">
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
										/>
									</svg>
									<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
										<span className="font-medium">Click to upload</span> or drag
										and drop
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										SVG, PNG, JPG or GIF (MAX. 800x400px)
									</p>
								</div>
								<input
									id="dropzone-file"
									type="file"
									className="hidden"
								/>
							</label>
						</div>
						{err && (
							<AlertMessage
								type="error"
								text={err.toString()}
							/>
						)}
						{msg && (
							<AlertMessage
								type="success"
								text={msg.toString()}
							/>
						)}
						<Button
							loading={loading}
							onClick={createNewGig}
							text="Add New Gig"
						/>
					</div>
				</SheetDescription>
			</SheetContent>
		</Sheet>
	);
}

export default SideDrawer;
