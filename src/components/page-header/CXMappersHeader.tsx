export default function CXMappersHeader({ subtitle }: { subtitle: string }) {
    return (
        <div className="flex flex-col gap-2 w-fit mx-auto fixed top-10 inset-x-0">
            <h1 className="text-center text-zinc-900 font-bold text-2xl">
                CX Mappers
            </h1>
            <p className="text-center text-zinc-700 font-medium text-sm uppercase py-1 px-3 rounded-xl bg-zinc-100">
                {subtitle}
            </p>
        </div>
    );
}
