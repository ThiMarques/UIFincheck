import { z } from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bankAccountsService } from "../../../../../app/services/bankAccountsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import { toast } from "react-hot-toast";
import { useState } from "react";

const schema = z.object({
  initialBalance: z.union([
    z.string().min(1, 'Saldo inicial é obrigatório'),
    z.number()
  ]),
  name: z.string().min(1, 'Nome da Conta é obrigatório'),
  type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
  color: z.string().min(1, 'Cor é obrigatório')
})

type FormData = z.infer<typeof schema>;

export function useEditAccountModalController() {
  const { isEditAccountModalOpen, closeEditAccountModal, accountBeingEdited } = useDashboard();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: accountBeingEdited?.color,
      name: accountBeingEdited?.name,
      type: accountBeingEdited?.type,
      initialBalance: accountBeingEdited?.initialBalance,
    }
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { 
    isLoading, 
    mutateAsync: updateAccount 
  } = useMutation(bankAccountsService.update);

  const { 
    isLoading: isLoadingDelete, 
    mutateAsync: removeAccount 
  } = useMutation(bankAccountsService.remove);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateAccount({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
        id: accountBeingEdited!.id,
      })

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success('A conta foi editada com sucesso!');
      closeEditAccountModal();
    } catch {
      toast.error('Erro ao salvar as alterações!');
    }
  })

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  async function handleDeleteAccount() {
    try {
      await removeAccount(accountBeingEdited!.id)

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success('A conta foi deletada com sucesso!');
      closeEditAccountModal();
    } catch {
      toast.error('Erro ao deletar a contas!');
    }
  }

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    handleSubmit,
    errors,
    control,
    isLoading,
    isDeleteModalOpen,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteAccount,
    isLoadingDelete
  }
}