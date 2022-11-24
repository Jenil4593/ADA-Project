app.get("/applicantform" , auth , async (req , res) => {
    const role = req.cookies.role;
    const xyz = req.cookies.xyz;
    // console.log(Applicant.find({userid : xyz}))
    const applicantDetail = async () => {
        const result = await Applicant.find({userid : xyz})
        return result  
    }
    const record = await applicantDetail()
    const applicationId = record[0]._id;
    
    var companyDetailToShow = [];
    const companyDetail = async () => {
        const appliedDetail = await Apply.find({applicationid : applicationId});
        
        var arr = [];
        async function eachFor(arr)
        {
            const length = appliedDetail.length;
            console.log(length);
            var i = 0;
            appliedDetail.forEach(async (element) =>  {
                // console.log(element);
                const xyz = await element.companyid;
                const companydtl = await Company.find({_id : xyz});
                // console.log(companydtl);
                await arr.push(companydtl[0]);
                i = i+1;
                // console.log(i);
                // console.log(arr);
                if(i === length)
                {
                    // console.log(i);
                    // console.log(length);
                    // console.log(arr);
                    var arr2 = arr;
                    console.log(arr2);
                    return arr2;
                }
            }); 
            // var arr2 = await arr;
            // return arr2;
        }

        var ans = await eachFor(arr);
        console.log(ans);
        // return await arr

    }

    companyDetailToShow = await companyDetail();
    // console.log(companyDetailToShow);

    if(role == 0)
    {
        if(record.length === 0)
        {
            return res.render("applicantform")
        }
        return res.render("main" , {"apprecord" : record[0] , "comprecord" : companyDetailToShow});
    }

    else if(role == 1)
    {
        return res.redirect("/company")
    }
})