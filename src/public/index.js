$('.dropdown').click(function(){

    $('.dropdown-menu').toggleClass('show');

});


const tagContainer = document.querySelector('.tag-container'); 
const inputBox = document.querySelector('.input-box'); 
tags = []

function countTags()
{
    inputBox.focus()

}

function remove(element , tag)
{
    let index = tags.indexOf(tag);
    tags = [tags.slice(0,index) , tags.slice(index+1)];
    element.parentElement.parentElement.remove();
    countTags();
}

function addTag(e){

    if(e.key == 'Enter')
    {
        let tag = e.target.value;
        let tag1 = e.target
        console.log(e.target);
        if(!tags.includes(tag))
        {
            tags.push(tag);   
            const liTag = `<li>${tag}<button type="button" class="close" aria-label="Close"><span aria-hidden="true" onclick="remove(this , '${tag}' )">&times;</span></button></li>`;
            tagContainer.insertAdjacentHTML("afterbegin" , liTag);
        }
        inputBox.value = '';
    }
}

countTags()
inputBox.addEventListener("keyup" , addTag);