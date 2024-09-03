import Image from 'next/image';
import React from 'react';
import { FormType, SectionType } from '../../utils/types';

type Props = {
  item: FormType;
};

const images = [
  '/form-images/date.png',
  '/form-images/multiple-choice.png',
  '/form-images/short-answer.png',
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

function FormItem({ item }: Props) {
  const randomImage = getRandomImage();
  return (
    <div className="col-span-1 flex rounded-xl overflow-hidden bg-white pressable-shadow">

      <div className="flex flex-col p-4">
        <p className="font-bold text-zinc-700 dark:text-zinc-100">
          {item.form.name}
        </p>
        <p className="text-zinc-500 dark:text-zinc-300 line-clamp-3 mb-2 max-w-md">
          {item.form.description}
        </p>
        <div className='flex items-center gap-2 mb-4 font-medium text-zinc-500 dark:text-zinc-300 '>
          <p className="text-sm">
            {5} min (est) to complete
          </p>
          <p>
            &bull;
          </p>
          <p className="text-sm">
            {item.form.sections.length} questions
          </p>
        </div>

        <div className="flex-1"></div>
        <div className="flex flex-row flex-wrap">
          {item.form.sections.map((item: SectionType) => (
            <span
              className="bg-zinc-200 text-xs font-medium mb-2 mr-2 rounded px-2 py-1 dark:bg-zinc-800 dark:text-white text-zinc-950"
              key={item.id}
            >
              {item.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormItem;
