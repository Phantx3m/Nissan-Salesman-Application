$(document).ready(function(){

    var editButtons;
    refreshModels();

    $("#add-model-submit").on('click', addModel);
    $("#add-version-submit").on('click', addVersion);
    $("#filter-category").on('change', filterCategory);

    function showModels(models){
        var result = "";

        var models = models.data;
        console.log("Hey");
    
        $.each(models, function(index, model){
            result += "<tr class='table__row-td'>";
            result += "<tr class='table__row-td'>";
            result += "<td class='table__td'>" + model.nombre + "</td>";
            result += "<td class='table__td'>" + model.anio + "</td>";
            result += "<td class='table__td'>" + model.categoria + "</td>";
            result += "<td class='table__td'>" + model.variantes.length + "</td>";
            result += "<td class='table__controls'>";
            result += "<div class='table__dropdown dropdown dropleft'>";
            result += "<a class='table__dropdown-button' id='data1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>...</a>";
            result += "<div class='table__dropdown-menu dropdown-menu' aria-labelledby='data1'>";
            result += "<a class='add-version_show table__dropdown-item dropdown-item' href='#' data-toggle='modal' data-target='.add-version' data-id='" + model._id + "'>Add Version</a>";
            result += "<a class='edit-employee_show table__dropdown-item dropdown-item' href='#' data-toggle='modal' data-target='.edit-employee' data-id='" + model._id + "'>Edit</a>";
            result += "<a class='remove-employee_show table__dropdown-item dropdown-item' href='#' data-toggle='modal' data-target='.delete-element' data-id='" + model._id + "'>Delete</a>";
            result += "</div>";
            result += "</div>";
            result += "</td>";
            result += "</tr>";
        });
    
        $("#table-models").html(result);

        $(".add-version_show").on('click', function(){
            var id = $(this).attr("data-id");

            $("#add-version-submit").attr("data-id", id);
        });
        
        editButtons = $(".edit-model_show");
        editButtons.on('click', fillFormWithModelInfo);
    }
   
    function refreshModels(){

        var URL = "http://localhost:3000/api/Modelos";
        
        $.ajax({
            url: URL,
            method: "GET",
            dataType: "json",
            success: showModels
        });

    }

    function addModel(){
        
        var modelForm = $("#add-model-form"),
            url = "/api/Modelos",
            data = {};
        
        modelForm.find('[name]').each(function(index, value){
            var name  = $(this).attr('name'),
                value = $(this).val();

            data[name] = value;
        });

        //data = JSON.stringify(data);
        console.log(data);

        var dataToSend = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            anio: data.anio,
            categoria: data.categoria,
            colores: {
                interiores: {
                    nombre: data.colores.interior.nombre,
                    codigo: data.colores.interior.codigo,
                },    
                exteriores:{
                    nombre: data.colores.exterior.nombre,
                    codigo: data.colores.exterior.codigo,
                } 
            },
            dimensiones: {
                alto: data.dimensiones.alto,
                ancho: data.dimensiones.ancho,
                largo: data.dimensiones.largo
            },
            imagenes: {
                urls: data.imagenes.urls,
                banner: data.imagenes.banner
            }
        };

        console.log(dataToSend);
        
        $.ajax({
            url: url,
            method: "POST",
            data: data,
            success: refreshModels
        });
    }

    function addVersion(){
        
        var versionForm = $("#add-version-form"),
            id = $("#add-version-submit").attr("data-id");
            url = "/api/Modelos/" + id + "/Variantes",
            data = {};
        
        console.log(url);

        var data = {
            nombre: $("#version-nombre").val(),
            precio: $("#version-precio").val(),
            caracteristicas: {
                aireAcondicionado: $("#version-aire").val(),
                pasajeros: $("#version-pasajeros").val(),
                capacidadTanque: $("#version-tanque").val(),
                puertas: $("#version-puertas").val(),
                quemacocos: $("#version-quemacocos").val(),
                convertible: $("#version-convertible").val(),
                rendimiento: $("#version-rendimiento").val(),
                potencia: $("#version-potencia").val(),
                torque: $("#version-torque").val(),
                transmision: $("#version-transmision").val(),
                traccion: $("#version-traccion").val()
            }
        };
        /*
        versionForm.find('[name]').each(function(index, value){
            var name  = $(this).attr('name'),
                value = $(this).val();

            data[name] = value;
        });

        data = JSON.stringify(data);*/
        
        console.log(data);
        
        
        $.ajax({
            url: url,
            method: "POST",
            data: data,
            success: refreshModels
        });
    }

    function fillFormWithModelInfo(){

        var id = $(this).attr("data-id");
        var URL = "/cars/" + id;

        console.log(URL);

        $.ajax({
            url: URL,
            method: "GET",
            dataType: "json",
            success: function(modelFound){

                console.log(modelFound);
                
                var form = $("#edit-model-form");

                var exteriores = modelFound.colores.exterior,
                    interiores = modelFound.colores.interior;

                var images = modelFound.photos.imagesURL;
                
                $('[name="model"]', form).val(modelFound.modelo);
                $('[name="year"]', form).val(modelFound.anio);
                $('[name="description"]', form).val(modelFound.descripcion);
                $('[name="category"]', form).val(modelFound.categoria);
                $('[name="dimensions[alto]"]', form).val(modelFound.dimensiones.alto);
                $('[name="dimensions[ancho]"]', form).val(modelFound.dimensiones.ancho);
                $('[name="dimensions[largo]"]', form).val(modelFound.dimensiones.largo);
                $('[name="photos[bannerImageURL]"]', form).val(modelFound.photos.bannerImageURL);
                
                var imagesInput = $('[name="photos[imagesURL]"]', form);

                console.log(imagesInput);
                while(images.length > 0){
                    imagesInput.val(images.pop());
                    imagesInput.pop();
                }

            }
        });

    }

    function filterCategory(){
        var category = $(this).val();

        if(category == "All"){
            var URL = "/cars";
        }else{
            var URL = "/cars/category/" + category;
        }

        $.ajax({
            url: URL,
            method: "GET",
            dataType: "json",
            success: showModels
        });
    }

});