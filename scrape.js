class Puzzle{
    constructor(title, price, unitCost){
       this.title = title;
       this.price = price;
       this.unitCost = unitCost;
    }
 }

 const request = require('request');
 const cheerio = require('cheerio');
 
 var puzzles = [];
 var number = 0;
 var numberOfPuzzles = 111;
 

 for(var page = 1; page <= 8; page++){
    url='https://www.i-puzzle.pl/miasta-i-budowle?page=' + page.toString();
    request(url, (error,response,html) => {
        if(!error && response.statusCode==200){
            const $ = cheerio.load(html);
            $('.product__item').each((i,el) =>{
                var numberOfElements = $(el).find('strong:nth-of-type(2)').text();
                if(numberOfElements != null) {
                    var name = $(el).find('.product_tit_span').text();
                    var price = $(el).find('.text-info').text();
                    var calculationprice=price.substring(0,2);
                    var unitCost = (calculationprice*100 / numberOfElements).toFixed(4);
                    var puzzle = new Puzzle(name,price,unitCost);
                    puzzles.push(puzzle);
                    console.log(number + 1, puzzle.title, puzzle.price);
                }else{
                    console.log(number + 1, 'Brak liczby elementów');
                }
                number++;
                if(number >= numberOfPuzzles){
                    sitePreparing(puzzles);
                }
            });
        }else{
            console.log("Problem z dostępem do strony");
            number += 24;
            if(number >= numberOfPuzzles)
            {
                sitePreparing(puzzles);
            }
        }
    });
 }

 function compare(x, y) {
    const puzzle1 = x.unitCost;
    const puzzle2 = y.unitCost;
  
    let result = 0;
    if (puzzle1 < puzzle2) {
        result = 1;
    }
    else if (puzzle1 > puzzle2) {
        result = -1;
    }
    return result;
}

function sitePreparing(puzzles){
    console.log('SORT');
    puzzles.sort(compare);
 
    console.log('lp. Nazwa                                     Cena[zł]  Cena jednostokowa[zł/100sztuk]');
    for(var i = 0; i < puzzles.length; i++){
       console.log(i + 1, puzzles[i].title, puzzles[i].price, puzzles[i].unitCost);
    }
 
    var http = require('http');
    var fs = require('fs');
 
    var table = '<table><tr><th>lp</th><th>Nazwa zestawu</th><th>Cena</th><th>Koszt jednostkowy</th></tr>';

    function onRequest(request, response) {
       response.writeHead(200, {'Content-Type': 'text/html'});
       fs.readFile('./indeks.html', null, function(error, data) {
          if (error) {
                response.writeHead(404);
                response.write('File not found!');
          } else {
                response.write(data);
 
                for(var i = 0; i < puzzles.length; i++){
                   table += '<tr>';
                   table += '<td>' + (i + 1).toString() + '</td>';
                   table += '<td>' + puzzles[i].title + '</td>';
                   table += '<td>' + puzzles[i].price + ' </td>';
                   table += '<td>' + puzzles[i].unitCost + 'zł/100sztuk </td>';
                   table += '</tr>';
                   console.log(i+1, puzzles[i].title, puzzles[i].price, puzzles[i].unitCost);
                }
                
                table += '</table>';
                response.write(table);
                
          }
          response.end();
       });
    }

    http.createServer(onRequest).listen(8000);
    
 }

