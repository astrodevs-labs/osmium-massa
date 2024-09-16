import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IDeployForm } from '@/types';
import { ArgTypes } from '@/enums.ts';

const useDeployParams = () => {
  const form = useFormContext<IDeployForm>();
  const [paramsCount, setParamsCount] = useState(0);

  const addParam = () => {
    setParamsCount(paramsCount + 1);
  };

  const removeParam = () => {
    if (paramsCount === 0) return;
    setParamsCount(paramsCount - 1);
  };

  useEffect(() => {
    form.resetField('params');
    for (let i = 0; i < paramsCount; i++) {
      form.setValue(`params.${i}` as const, {
        value: '',
        type: Object.getOwnPropertyNames(ArgTypes).filter((value) => !isNaN(Number(value)))[0],
      });
    }
  }, [paramsCount]);

  return {
    form,
    paramsCount,
    addParam,
    removeParam,
  };
};

export default useDeployParams;
