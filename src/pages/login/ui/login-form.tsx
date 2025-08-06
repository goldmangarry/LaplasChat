import { useNavigate, useSearch } from "@tanstack/react-router";
import type React from "react";
import { useState, useEffect } from "react";
import { Button, Input } from "@chakra-ui/react";
import { useUserStore } from "@/core/store/user/store";
import { loginRequest } from "../model/api";
import type { LoginResponse } from "../model/types";
import { Stack, Center, Field, Container, Box, Heading, Text } from "@chakra-ui/react";
import googleIcon from "@/assets/icons/google.svg";

export const LoginForm: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });
	const { login, setLoading, isLoading } = useUserStore();

	// Handle OAuth errors from URL params
	useEffect(() => {
		if (search?.error === 'oauth_failed') {
			setError('Ошибка входа через Google. Попробуйте еще раз.');
		}
	}, [search?.error]);

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

			const redirectTo = search.redirect || "/";
			navigate({ to: redirectTo as "/" });
		} catch (err) {
			console.error("Login failed:", err);
			setError("Ошибка входа. Проверьте правильность введенных данных.");
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
						<Heading size={{ base: '2xl', md: '3xl' }}>Добро пожаловать</Heading>
					</Stack>
					<Stack gap="6">
						<Stack gap="5">
							<Field.Root>
								<Field.Label>Электронная почта</Field.Label>
								<Input 
									type="email" 
									value={username}
									onChange={handleUsernameChange}
									placeholder="Введите адрес электронной почты"
									required
									disabled={isLoading}
								/>
							</Field.Root>
							<Field.Root>
								<Field.Label>Пароль</Field.Label>
								<Input 
									type="password" 
									value={password}
									onChange={handlePasswordChange}
									placeholder="Введите пароль"
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
								loadingText="Вход в систему..."
								disabled={!username || !password || isLoading}
							>
								Войти
							</Button>
							
							<Text fontSize="sm" color="gray.500" textAlign="center">
								или
							</Text>
							
							<Button
								size="lg"
								variant="outline"
								onClick={() => {
									window.location.href = `https://dev-apilaplas-backend.onrender.com/auth/login/google`;
								}}
								disabled={isLoading}
							>
								<img 
									src={googleIcon} 
									alt="Google" 
									style={{ width: '20px', height: '20px', marginRight: '8px' }}
								/>
								Войти через Google
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</form>
		</Container>
	);
};
