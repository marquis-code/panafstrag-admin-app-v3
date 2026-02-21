export const useBoard = () => {
  const { fetchWithAuth } = useApi();

  const getBoardMembers = async () => {
    return fetchWithAuth('/board');
  };

  const getBoardMember = async (id: string) => {
    return fetchWithAuth(`/board/${id}`);
  };

  const createBoardMember = async (data: any) => {
    return fetchWithAuth('/board', {
      method: 'POST',
      body: data,
    });
  };

  const updateBoardMember = async (id: string, data: any) => {
    return fetchWithAuth(`/board/${id}`, {
      method: 'PATCH',
      body: data,
    });
  };

  const deleteBoardMember = async (id: string) => {
    return fetchWithAuth(`/board/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getBoardMembers,
    getBoardMember,
    createBoardMember,
    updateBoardMember,
    deleteBoardMember,
  };
};
