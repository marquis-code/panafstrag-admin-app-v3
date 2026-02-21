export const useCell = () => {
  const { fetchWithAuth } = useApi();

  const getCells = async () => {
    return fetchWithAuth('/cell');
  };

  const getCell = async (id: string) => {
    return fetchWithAuth(`/cell/${id}`);
  };

  const createCell = async (data: any) => {
    return fetchWithAuth('/cell', {
      method: 'POST',
      body: data,
    });
  };

  const updateCell = async (id: string, data: any) => {
    return fetchWithAuth(`/cell/${id}`, {
      method: 'PATCH',
      body: data,
    });
  };

  const deleteCell = async (id: string) => {
    return fetchWithAuth(`/cell/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getCells,
    getCell,
    createCell,
    updateCell,
    deleteCell,
  };
};
