import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from '@/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { moveItemUp, moveItemDown, removeItem, resetTop10, Top10Item } from '@/store/slices/admin/adminTop10Slice';
import { useCreateDataMutation } from '@/services/api';
import toast from 'react-hot-toast';

export const TopList = () => {
  const dispatch = useDispatch();
  const [createItem] = useCreateDataMutation();

  const { items, objectType, title, size, maxChances,gameId } = useSelector((state: RootState) => state.adminTop10);

  const handleMoveUp = (id: number) => dispatch(moveItemUp(id));
  const handleMoveDown = (id: number) => dispatch(moveItemDown(id));
  const handleRemoveRow = (id: number) => dispatch(removeItem(id));
  const handleReset = () => dispatch(resetTop10());

  const handleSubmit = async () => {
    console.log("Submitting data:", items, objectType);
    await toast.promise(
      createItem({
        url: '/api/v1/admin/games-list/top-list', body: {
          items: items.map((r, index) => ({
            pos: index + 1,
            id: r.id
          })),
          game_id:gameId,
          size: size,
          max_chances: maxChances,
          title: title,
          type: objectType
        }
      }).unwrap(),
      {
        loading: `Adding Top List...`,
        success: `Top List game added successfully`,
        error: `Failed to add the game`,
      }
    ).then(() => {
      handleReset()
    });
  };

  return (
    <div className="rounded bg-white p-4 border-2 border-primary">
      <h2 className="text-2xl font-bold mb-4">Items</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">{objectType}</th>
              <th className="py-3 px-6 text-center"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {items.length === 0 && (
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-center whitespace-nowrap" colSpan={3}>
                  No Items...Select items from selector
                </td>
              </tr>
            )}
            {items.map((row: Top10Item, index) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{row.name}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-end space-x-2">
                    <button
                      onClick={() => handleMoveUp(row.id)}
                      disabled={index === 0}
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                    >
                      <ArrowUpIcon />
                    </button>
                    <button
                      onClick={() => handleMoveDown(row.id)}
                      disabled={index === items.length - 1}
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                    >
                      <ArrowDownIcon />
                    </button>
                    <button
                      onClick={() => handleRemoveRow(row.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 py-4 mt-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded bg-accent bg-opacity-90 uppercase text-primary border border-primary hover:bg-opacity-100 min-w-[100px]"
        >
          reset
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 rounded bg-primary bg-opacity-90 uppercase text-secondary hover:bg-opacity-100 min-w-[100px]"
        >
          Submit game
        </button>
      </div>
    </div>
  );
};
