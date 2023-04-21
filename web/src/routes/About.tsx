function About (): JSX.Element {
  return (
        <div className="w-full bg-gray-100 rounded-lg mx-auto my-20 pt-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold">About the IVENT-Platform</h1>
            <div className="card">
                <div className="text-center">
                    <p className="text-lg mb-10">
                        The IVENT Platform is a platform that collects hundreds of relevant events from different
                        sources and visualizes
                        them appealingly so that everybody can plan their events in the best way possible. It was
                        founded by two CS students
                        from LMU Munich, Fabian and Simon.
                    </p>
                    <p className="text-lg mb-10">
                        Follow us on
                        <a className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 text-lg ml-2"
                           href="https://github.com/fkropfhamer/ivent-platform">Github</a>
                        .
                    </p>
                    <p className="text-lg font-bold">Made with ❤ in Munich</p>
                </div>
            </div>
        </div>
  )
}

export default About
