export default function Footer({ font = "" }: { font?: string }) {
  return (
    <footer className={`py-12 bg-gray-900 text-gray-100 ${font}`}>
      <div className="max-w-400 px-12 mx-auto flex justify-between">
        <p className="text-xl">@ CAB Inc.</p>
      </div>
    </footer>
  );
}
