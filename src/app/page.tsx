import PDFRotator from '@/components/PDFRotator'

export default function Home() {
  return (
    <div className="container mx-auto py-20 space-y-5">
      <h1 className="text-5xl font-serif text-center tiempos">
        Rotate PDF Pages
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Simply click on a page to rotate it. You can then download your modified PDF.
      </p>
      <PDFRotator />
    </div>
  )
}
