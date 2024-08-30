import React from 'react';
import GeneralLayout from '../../layout/GeneralLayout';
import Search from '../../components/search/Search';
import { ArrowPathIcon, LinkIcon, PlusIcon } from '@heroicons/react/24/outline';
import FormItem from '../../components/form-item/FormItem';
import useForms from '../../hooks/useForms';
import { ArrowUpRight, SearchIcon } from 'lucide-react';

function Forms() {
  const { forms, loading, error } = useForms();

  const generateFormsLink = () => {
    const url = `${process.env.NEXT_PUBLIC_FORMS_URL}/?type=shared&id=190911`;
    console.log(url);
    window.open(url, '_blank');
  };


  return (
    <GeneralLayout>
      <div className='flex flex-row items-start justify-between mb-6'>
        <p className='text-start font-bold text-zinc-900 text-3xl '>
          Forms
        </p>
        <div className='flex flex-row items-center space-x-4'>
          <button className='h-[32px] px-3 rounded-lg font-semibold flex items-center text-zinc-900 bg-white pressable-shadow'>
            Create form <ArrowUpRight size={16} className='ml-2' />
          </button>
          <button className='size-[32px] rounded-lg font-semibold flex items-center justify-center text-zinc-900 bg-white pressable-shadow'>
            <SearchIcon size={16} />
          </button>
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto">
        {loading && <div>loading</div>}
        {error && <div>errrrrr</div>}
        <div className="grid grid-cols-3 gap-8">
          {forms.map((item) => (
            <FormItem
              key={item.id}
              item={item} // Spread the properties to match the FormItem props
            />
          ))}
        </div>
      </div>
    </GeneralLayout>
  );
}

export default Forms;
