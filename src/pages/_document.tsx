import Document, {Html, Head, Main, NextScript} from 'next/document';
import {Theme} from '@radix-ui/themes';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link
						rel="preconnect"
						href="https://fonts.googleapis.com"
					/>
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
						rel="stylesheet"
					/>
				</Head>
				<body className="subpixel-antialiased">
					<Theme>
						<Main />
						<NextScript />
					</Theme>
				</body>
			</Html>
		);
	}
}

export default MyDocument;
