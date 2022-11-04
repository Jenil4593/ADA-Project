$(document).ready(() => {
    
    $(".dropdown").click(function () {
        $(".dropdown-menu").toggleClass("show");
    });
    
    const tagContainer = document.querySelector(".tag-container");
    // selecting all input box
    const inputBoxDep = document.querySelectorAll(".input-box")[0];
    const inputBoxSkills = document.querySelectorAll(".input-box")[1];
    const inputBoxQuali = document.querySelectorAll(".input-box")[2];
    // const inputBoxQualiApp = document.querySelector(".input-box-app");
    // selecting all add tag
    const addingBtnDep = document.querySelectorAll(".add-tag")[0];
    const addingBtnSkills = document.querySelectorAll(".add-tag")[1];
    const addingBtnQuali = document.querySelectorAll(".add-tag")[2];
    // const addingBtnQualiApp = document.querySelector(".add-tag-app");
    // selecting all option tag(haven't used yet )
    const optionTagDep = document.querySelector(".option-tag1");
    const optionTagSkills = document.querySelector(".option-tag2");
    const optionTagQuali = document.querySelector(".option-tag3");
    // const optionTagQualiApp = document.querySelector(".option-tag4");
    tags = [];
    
    function countTags() {
        //   inputBox.focus();
    }
    
    function remove(element, tag) {
        console.log(element);
    }
    
    function addTag(e) {
        //   let tag = inputBoxQuali.value;
        //   console.log(tag);
        console.log("Enter in if");
        console.log(e);
        
        console.log("Enter end in if");
        if (e == 1)
        {
            optionText = inputBoxDep.value;
            optionValue = inputBoxDep.value;
            $(".option-tag1").append(new Option(optionText, optionValue , false , true));
        }

        else if (e == 2) 
        {
            optionText = inputBoxSkills.value;
            optionValue = inputBoxSkills.value;
            $(".option-tag2").append(new Option(optionText, optionValue , false , true));
        }
        
        else if (e == 3)
        {
            optionText = inputBoxQuali.value;
            optionValue = inputBoxQuali.value;
            $(".option-tag3").append(new Option(optionText, optionValue , false , true));
        }
        
        else if (e == 4)
        {
            optionText = inputBoxQualiApp.value;
            optionValue = inputBoxQualiApp.value;
            $(".option-tag4").append(new Option(optionText, optionValue , false , true));
        }
    
    //   const opt = document.getElementsByTagName("option");
    
        inputBoxDep.value = "";
        inputBoxSkills.value = "";
        inputBoxQuali.value = "";
        inputBoxQualiApp.value = "";
}

countTags();
// inputBox.addEventListener("keyup", addTag);
    addingBtnDep.addEventListener("click", function () {
        addTag(1);
    });
    addingBtnSkills.addEventListener("click", function () {
        addTag(2);
    });
    addingBtnQuali.addEventListener("click", function () {
        addTag(3);
    });
    // addingBtnQualiApp.addEventListener("click", function () {
    //     console.log("Qualiapp called");
    //     addTag(4);
    // });

})