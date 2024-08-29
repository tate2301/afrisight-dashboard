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
    <div className="col-span-1 max-w-xs border border-zinc-200/50 dark:border-zinc-500/50 flex flex-col rounded-xl overflow-hidden">
      <div className="bg-white  h-40 w-full p-4  border-b border-zinc-200/50">
        <div
          className={`bg-zinc-100 h-36 relative w-full overflow-hidden rounded-t-lg`}
        >
          <Image
            src={randomImage}
            className={'object-cover  rounded-t-lg '}
            alt="expense tracker"
            fill
            loading="lazy"
            quality={75}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2 p-4">
        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-100">
          {item.form.name}
        </p>
        <p className="text-zinc-500 dark:text-zinc-300 text-xs">
          {5} (est) to complete
        </p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-300 line-clamp-3">
          {item.form.description}
        </p>
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
