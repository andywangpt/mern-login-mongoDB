export async function GET(request) {

   return new Response('GET request recieved', { status: 200 })
}

export async function POST(request) {
   return new Response('POST request received', { status: 200 })
}


