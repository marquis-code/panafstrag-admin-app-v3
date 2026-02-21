export const useArchive = () => {
  const { fetchWithAuth } = useApi();

  const getArchives = async () => {
    return fetchWithAuth('/archive');
  };

  const getArchive = async (id: string) => {
    return fetchWithAuth(`/archive/${id}`);
  };

  const createArchive = async (data: any) => {
    return fetchWithAuth('/archive', {
      method: 'POST',
      body: data,
    });
  };

  const updateArchive = async (id: string, data: any) => {
    return fetchWithAuth(`/archive/${id}`, {
      method: 'PATCH',
      body: data,
    });
  };

  const deleteArchive = async (id: string) => {
    return fetchWithAuth(`/archive/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getArchives,
    getArchive,
    createArchive,
    updateArchive,
    deleteArchive,
  };
};
