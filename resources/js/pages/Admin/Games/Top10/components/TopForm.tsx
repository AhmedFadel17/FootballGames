import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import InputLabel from '@/components/InputLabel';
import { useGetDataQuery } from '@/services/api';
import { useAppDispatch } from '@/store';
import { ObjectType, setGameId, setMaxChances, setObjectType, setSize, setTitle } from '@/store/slices/admin/adminTop10Slice';
import React, { useEffect, useState } from 'react';

const objectOptions = [
  { value: 'player', label: 'Player' },
  { value: 'team', label: 'Team' },
  { value: 'country', label: 'Country' },
];

export const TopForm = () => {
  const dispatch = useAppDispatch();
  const [gamesOptions, setGamesOptions] = useState([]);

  const { data, isLoading, isSuccess } = useGetDataQuery({
    url: "/api/v1/admin/games?game_type_id=2",
  });

  useEffect(() => {
    if (isSuccess && data) {
      setGamesOptions(data.map((row: Game) => ({ value: row.id, label: row.title })));
    }
  }, [isSuccess, data]);
  const handleObjectSelectChange = (value: string) => {
    dispatch(setObjectType(value as ObjectType));
  };

    const handleGameSelectChange = (value: string) => {
    dispatch(setGameId(Number(value)));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSize(Number(e.target.value)));
  };

  const handleMaxChancesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMaxChances(Number(e.target.value)));
  };


  return (
    <div className="rounded bg-white p-4 border-2 border-primary">
      <h2 className="text-2xl font-bold mb-4">Top List</h2>
      <div className="flex items-center gap-4 py-4">
        <div className="w-full">
          <InputLabel className="mb-1" value="Object">
            Game
          </InputLabel>
          <Select
            options={gamesOptions}
            placeholder='select a game'
            onChange={handleGameSelectChange}
          />
        </div>
        <div className="w-full">
          <InputLabel className="mb-1" value="Title">
            Title
          </InputLabel>
          <Input
            type="text"
            placeholder="Enter Title"
            onChange={handleTitleChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 py-4">

        <div className="w-full">
          <InputLabel className="mb-1" value="Size">
            Size
          </InputLabel>
          <Input
            type="number"
            min={5}
            max={20}
            placeholder="Enter Size"
            onChange={handleSizeChange}
          />
        </div>
        <div className="w-full">
          <InputLabel className="mb-1" value="Max Chances">
            Max Chances
          </InputLabel>
          <Input
            type="text"
            min={1}
            max={20}
            placeholder="Enter Max Chances"
            onChange={handleMaxChancesChange}
          />
        </div>
        <div className="w-full">
          <InputLabel className="mb-1" value="Object">
            Object
          </InputLabel>
          <Select
            options={objectOptions}
            defaultValue='player'
            onChange={handleObjectSelectChange}
          />
        </div>

      </div>
    </div>
  );
};
