export const useProgram = () => {
  const { fetchWithAuth } = useApi();

  const getPrograms = async () => {
    return fetchWithAuth('/program');
  };

  const getProgram = async (id: string) => {
    return fetchWithAuth(`/program/${id}`);
  };

  const createProgram = async (data: any) => {
    return fetchWithAuth('/program', {
      method: 'POST',
      body: data,
    });
  };

  const updateProgram = async (id: string, data: any) => {
    return fetchWithAuth(`/program/${id}`, {
      method: 'PATCH',
      body: data,
    });
  };

  const deleteProgram = async (id: string) => {
    return fetchWithAuth(`/program/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram,
  };
};
