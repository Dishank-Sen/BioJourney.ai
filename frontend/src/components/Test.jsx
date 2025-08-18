export default async function Test(){
    const res = await fetch(`https://${import.meta.env.VITE_EC2_ENDPOINT}/test`)
    console.log(res)
    return(
        <p>{res}</p>
    )
}