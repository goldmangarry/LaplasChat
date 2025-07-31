import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import { useUserStore } from "@/core/store/user/store";
import { loginRequest } from "../model/api";
import type { LoginResponse } from "../model/types";
import { Stack, Center, Field, Container, Box, Heading, Text } from "@chakra-ui/react";

export const LoginForm: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { login, setLoading, isLoading } = useUserStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response: LoginResponse = await loginRequest(username, password);

			// Create temporary user object - real data will be loaded via fetchUserProfile
			const tempUser = {
				id: 'temp',
				email: username,
				first_name: 'Loading',
				last_name: '...',
				avatar_url: '',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			// Save tokens and temporary user to store
			login(response.access_token, response.refresh_token, tempUser);

			// Redirect to home page
			navigate({ to: "/" });
		} catch (err) {
			console.error("Login failed:", err);
			setError("Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
		setError(""); // Clear error when user starts typing
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setError(""); // Clear error when user starts typing
	};

	return (
		<Container maxW="md" py={{ base: '12', md: '24' }}>
			<form onSubmit={handleSubmit}>
				<Stack gap="8">
					<Center>
						<Box width="148px" height="40px">
							<img
								src="/assets/logo-chat.svg"
								alt="apilaplas"
								width="148"
								height="40"
								style={{ width: '148px', height: '40px' }}
							/>
						</Box>
					</Center>
					<Stack gap={{ base: '2', md: '3' }} textAlign="center">
						<Heading size={{ base: '2xl', md: '3xl' }}>Welcome</Heading>
					</Stack>
					<Stack gap="6">
						<Stack gap="5">
							<Field.Root>
								<Field.Label>Email</Field.Label>
								<Input 
									type="email" 
									value={username}
									onChange={handleUsernameChange}
									placeholder="Enter your email"
									required
									disabled={isLoading}
								/>
							</Field.Root>
							<Field.Root>
								<Field.Label>Password</Field.Label>
								<Input 
									type="password" 
									value={password}
									onChange={handlePasswordChange}
									placeholder="Enter your password"
									required
									disabled={isLoading}
								/>
							</Field.Root>
							{error && (
								<Text color="red.500" fontSize="sm" textAlign="center">
									{error}
								</Text>
							)}
						</Stack>
						<Stack gap="3">
							<Button 
								type="submit"
								size="lg" 
								colorScheme="teal"
								loading={isLoading}
								loadingText="Signing in..."
								disabled={!username || !password || isLoading}
							>
								Sign in
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</form>
		</Container>
	);
};
