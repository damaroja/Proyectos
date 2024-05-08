

const fs = require("fs");

const OPTIONS = {
  templateDir: "./templates/",
  dataOut: "./templates/",
};

class TemplateEngine {
  constructor(data, templateName, options = OPTIONS) {
    this.data = data;
    this.templateName = templateName;
    this.options = options;
  }

  // Función para cargar una plantilla desde el sistema de archivos
  loadTemplate(templateName = this.templateName) {
    const dir = this.options.templateDir || "./template/";
    if (!dir || dir === "")
      throw new Error("No se ha especificado la ruta de la plantilla");
    try {
      // Lee el contenido de la plantilla desde el sistema de archivos
      return fs.readFileSync(dir + templateName + ".html", "utf8");
    } catch (error) {
      console.error("Error al cargar la plantilla:", error);
      return null;
    }
  }
  // Función para parsear una plantilla
/*   parseTemplate(templateContent) {
    const tokens = [];
    const regexVar = /{%(.*?)%}/g;
    const regexEach = /{{#each\s+(.*?)}}(.*?){{\/each}}/gs;
    const regexIf = /{{#if\s+(.*?)}}(.*?){{\/if}}/gs;
    let matchVar;
    let matchEach;
    let matchIf;
    while ((matchVar = regexVar.exec(templateContent)) !== null) {
      tokens.push({
        type: "variable",
        value: matchVar[1].trim(),
      });
    }
    while ((matchEach = regexEach.exec(templateContent)) !== null) {
      const iterator = matchEach[1].trim();
      const content = matchEach[2].trim();

      tokens.push({
        type: "each_start",
        iterator,
      });

      const regexVar = /{{\s*(.*?)\s*}}/g;
      let matchVar;
      let variables = [];
      while ((matchVar = regexVar.exec(content)) !== null) {
        variables.push(matchVar[1].trim());
      }

      tokens.push({
        type: "each_variables",
        variables,
      });

      tokens.push({
        type: "each_end",
      });
    }
    while ((matchIf = regexIf.exec(templateContent)) !== null) {
      const condition = matchIf[1].trim();
      const content = matchIf[2].trim();

      const regexVar = /{%(.*?)%}/g;
      let matchVar;
      let variables = [];
      while ((matchVar = regexVar.exec(content)) !== null) {
        variables.push(matchVar[1].trim());
      }

      tokens.push({
        type: "if_start",
        condition,
      });

      tokens.push({
        type: "content",
        value: variables.join(", "),
        variables,
      });

      tokens.push({
        type: "if_end",
      });
    }
    return tokens;
  } */


  parseTemplate(templateContent) {
    const tokens = [];
    const regex = /{%(.*?)%}/g;
    let match;
    while ((match = regex.exec(templateContent)) !== null) {
        tokens.push({
            type: 'variable', // Tipo de token (variable en este caso)
            value: match[1].trim() // Valor del token (el contenido dentro de los delimitadores)
        });
    }
    return tokens;
};


/*   processTemplate(templateData, templateStructure) {
     Aquí puedes implementar la lógica para procesar la plantilla
     y aplicar los datos dinámicos proporcionados
     Retorna la plantilla procesada como una cadena de texto
  }
 */


  processTemplate(tokens, data) {
    let processedTemplate = '';

    // Iterar sobre cada token generado por parseTemplate
    tokens.forEach(token => {
        switch (token.type) {
            case 'variable':
                // Si el token es una variable, obtener su valor del objeto de datos y agregarlo al template procesado
                processedTemplate = {
                   ...processedTemplate,
                    [token.value]: data[token.value]
                }
                break;
            case 'if_start':
                // Aquí podrías aplicar la lógica para manejar bloques if según la condición
                // Por ejemplo, verificar si la condición es verdadera en los datos y agregar el contenido del bloque if al template procesado si es así
                if (data[token.condition]) {
                    processedTemplate += this.processTemplate(token.content, data);
                }
                break;
            case 'content':
                // Si el token es contenido simple, agregarlo directamente al template procesado
                processedTemplate += token.value;
                break;
            // Aquí puedes agregar más casos para manejar otros tipos de tokens, como bloques each, etc.
        }
    });

    return processedTemplate;
};
   /* renderTemplate() { 
     Aquí puedes implementar la lógica para renderizar la plantilla
    en el formato deseado, como HTML, texto plano, etc.
     Retorna la plantilla renderizada
  } */

   renderTemplate(data, template) {
    // Sustituir las variables en la plantilla con los valores correspondientes del objeto de datos
    let renderedTemplate = template.replace(/{%(.*?)%}/g, (match, variable) => {
        // Obtener el valor de la variable del objeto de datos
        return data[variable.trim()] || '';
    });

    return renderedTemplate;
}

  loadAndRender(data) {
    const templateContent = this.loadTemplate();
    const templateStructure = this.parseTemplate(templateContent);
    const templateData = this.processTemplate(data, templateStructure);
    return this.renderTemplate(templateData);
  }
}

const writeFile = (fileName, data) => {
  fs.writeFile(fileName, data, function(err) {
    if (err) {
        console.error('Error', err);
    } else {
        console.log('Exito!');
    }
  });
}

const myTemplate = new TemplateEngine();
const templateContent = myTemplate.loadTemplate("overview");
const templateStructure = myTemplate.parseTemplate(templateContent);
datos = {
  saludo: "Hola gilipollas",
  saludo2: "Eres del Psoe",
  saludo3: "Porque estes idiota",
}
const out = myTemplate.processTemplate(templateStructure, datos)
const htmlout = myTemplate.renderTemplate(out, templateContent);
writeFile('text2.html', htmlout)
console.log(htmlout);
