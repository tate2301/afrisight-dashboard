const Spinner = () => {
    return (
        <span className="flex justify-center items-center">
            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ borderRadius: '50%' }}>
                <span className="w-full h-full rounded-full" style={{ borderRadius: '50%' }}></span>
            </span>
        </span>
    )
}

export default Spinner