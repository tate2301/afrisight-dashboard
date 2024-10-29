import React from 'react';
import styles from './misc.module.css';

const LoginPage = () => {
	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h2 className={styles.header}>Login</h2>
				<form>
					<div className={styles.inputGroup}>
						<label
							className={styles.label}
							htmlFor="email">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className={styles.input}
							required
						/>
					</div>
					<div className={styles.inputGroup}>
						<label
							className={styles.label}
							htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className={styles.input}
							required
						/>
					</div>
					<div className={styles.actions}>
						<button
							type="submit"
							className={styles.button}>
							Log In
						</button>
					</div>
				</form>
				<div className={styles.links}>
					<a
						href="/forgot-password"
						className={styles.link}>
						Forgot Password?
					</a>
					<a
						href="/sign-up"
						className={styles.link}>
						Create Account
					</a>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
