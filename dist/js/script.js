
// Function to generate random number 
function getGenetik(min, max, len) { 
    let string = ""
    for (let i = 0; i < len; i++) {
        let angka = Math.floor(Math.random() * (max - min) + min)

        string += String.fromCharCode(angka)
    }
    return string
}


function getFitnessValue(gen, target){
    let fv = 0;
    for (let i = 0; i < gen.length; i++) {
        if (gen[i] == target[i]) fv++
        // console.log(gen[i], target[i], fv);
    }
    return (fv / target.length) * 100
}

function crossover(parent1, parent2, delimiter) {
    let p1 = [parent1.slice(0, delimiter), parent1.slice(delimiter)]

    let p2 = [parent2.slice(0, delimiter), parent2.slice(delimiter)]

    let child1 = p1[0]+p2[1] 
    let child2 = p2[0]+p1[1] 
    return [child1, child2]
}

function mutasi(child, learning_rate){
    let mutan = child
    let hasilMutan = ''
    for (let i = 0; i < mutan.length; i++) {
        let randomNumber = Math.random(0, 1)
        
        let angka = Math.floor(Math.random() * (126 - 32) + 32)

        let replacement = String.fromCharCode(angka)
        if (randomNumber < learning_rate){
            hasilMutan += replacement
        }else{
            hasilMutan += mutan[i]
        }
    }

    return hasilMutan
}

// console.log(randomNumber(32, 126, target.length));
let panjang_populasi = 10
let populasi = []
let target
let process = false // set to false if u want more fast, but you can'nt see the process😎
loadCheckProcessCondition()

function goAnalyis(){
    
    target = $("#query").val()
    if(!target) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your query is empty!',
          })
    }

    // 3. bikin populasi
    for (let i = 0; i < panjang_populasi; i++) {
        // 1. bikin representasi genetiknya [32-126]
        let gen = getGenetik(32, 126, target.length)
        // 2. bikin fitnes valuenya
        let fv = getFitnessValue(gen, target)
        populasi[i] = {
            gen,
            fv
        }
    }
    let counter = 0
    
    let cond = true
    $("#target").html(target)
    if(process){
        let inter = setInterval(() => {
            algo_ga(
            function(params) {
                $("#best-gen").html(params)
                $("#regneration").html(++counter)
                return Swal.fire({
                    icon: 'success',
                    toast: true,
                    position: 'top-end',   
                    showConfirmButton: false,
                    timer: 1500,
                    title: 'Yeey, I know what you mind!',
                })
            }, 
            function() {
                clearInterval(inter)
            })
        }, 0);
    }else{
        loader(true, function(){
            setTimeout(() => {
                while (cond) {
                algo_ga(
                    function(params) {
                        $("#best-gen").html(params)
                        $("#regneration").html(++counter)
                    }, 
                    function() {
                        // clearInterval(inter)
                        loader(false)
                        cond = false
                    })
                }
            }, 500);
        })
        
    }

}

function loadCheckProcessCondition(){
    if(process){
        $('#process').prop("checked", true) 
    }
}

function change(){
    if($('#process').is(':checked')){
        process = true
    } else{
        process = false
    }
}

function loader(cond, cb = false){
    if(cond){
        $(".loader-div").css("opacity", '1')
        $(".loader-div").removeClass("z-index-lowwer")
    }else{
        $(".loader-div").css("opacity", '0')
        $(".loader-div").addClass("z-index-lowwer")
    }
    if(cb) cb()
}

function algo_ga(best_gen, done){
    
    // 4. melakukan seleksi
    
    // 4.1 sorting dulu
    populasi = populasi.sort((a, b) => b.fv - a.fv)
    // 4.2 ambil 2 gen terbaik
    let parent1 = populasi[0]
    let parent2 = populasi[1]
    
    // 5. melakukan cross-over
    let delimiter = Math.floor(target.length / 2)
    let [child1, child2] = crossover(parent1.gen, parent2.gen, delimiter)
    
    
    // 6. melakukan mutasi dan hitung fitness function
    let learning_rate = 0.2
    let mutan1 = mutasi(child1, learning_rate)
    let fv1 = getFitnessValue(mutan1, target)
    let mutan2 = mutasi(child2, learning_rate)
    let fv2 = getFitnessValue(mutan2, target)
    
    
    
    // console.log(populasi, parent1, child1, mutan1, fv1);
    // 7. regenerasi
    if(populasi[populasi.length - 2].fv <= fv1){
        populasi[populasi.length - 2] = {
            gen: mutan1,
            fv: fv1
        }
    }
    
    if(populasi[populasi.length - 1].fv <= fv2){
        populasi[populasi.length - 1] = {
            gen: mutan2,
            fv: fv2
        }
    }
    populasi = populasi.sort((a, b) => b.fv - a.fv)
    // console.log(populasi)
    // let new_populasi = populasi
    // console.log(new_populasi)
    // console.log(parseInt(populasi[0].fv));
    best_gen(populasi[0].gen)
    if(parseInt(populasi[0].fv) == 100) done()
    
}

// console.log([parent1, parent2, child1, child2, populasi]);


// console.log(populasi, counter);
