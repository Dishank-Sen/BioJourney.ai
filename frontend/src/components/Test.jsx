export default async function Test(){
    const res = await fetch(`https://65.1.248.181/test`)
    console.log(res)
    return(
        <p>{res}</p>
    )
}