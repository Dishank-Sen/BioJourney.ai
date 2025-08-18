export default async function Test(){
    const res = await fetch(`http://${import.meta.env.VITE_EC2_ENDPOINT}/test`)
    console.log(res)
}