import { documents } from 'index.js'

function HomeScreen() { //SMALL MOCK UP of creating a home-screen with top 10 recently edited documents
    

    
    return (

        <div
            id="documents"
        >
            {
                documents.map((element, index) => {
                    if (index < 10) {
                        let id = element.key
                        let url = "/edit/" + id
                        //print out link for top 10 documents
                        //not yet completed
                    }
                })
            }
        </div >

    )
}

export default HomeScreen;