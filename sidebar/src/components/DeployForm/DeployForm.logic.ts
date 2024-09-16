import { useEdit } from '@hooks/useEdit.ts';
import { IDeployForm, VSCode } from '@/types';
import { useFormContext } from 'react-hook-form';

const useDeployForm = (vscode: VSCode) => {
  const { editWallet, editEnvironment } = useEdit(vscode);
  const {
    register,
    formState: { errors },
  } = useFormContext<IDeployForm>();

  return { register, errors, editWallet, editEnvironment };
};

export default useDeployForm;
