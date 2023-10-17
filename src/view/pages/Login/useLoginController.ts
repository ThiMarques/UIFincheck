import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { authService } from "../../../app/services/authService";
import { useMutation } from "@tanstack/react-query";
import { SigninParams } from "../../../app/services/authService/sigin";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../app/hooks/useAuth";

const schema = z.object({
  email: z.string().
  // nonempty('E-mail é obrigatório').
  min(1, 'Email é obrigatório').
  email('Informe um e-mail válido'),
  password: z.string().
  // nonempty('Senha é obrigatória').
  min(1, 'Senha é obrigatória').
  min(8, 'Senha deve conter pelo menos 8 digitos'),
})

type FormData = z.infer<typeof schema>;

export function useLoginController() {
  const { 
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (data: SigninParams) => {
      return authService.signin(data);
    },
  })

  const { signin } = useAuth();

  const handleSubmit = hookFormSubmit(async (data) => {
  try {
    const { accessToken } = await mutateAsync(data);

    signin(accessToken);
  } catch {
    toast.error('Credenciais inválidas!')
  }
  });

  return { handleSubmit, register, errors, isLoading };
}