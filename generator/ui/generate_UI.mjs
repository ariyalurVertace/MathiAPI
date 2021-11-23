import fs from "fs";
import lodash from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import inquirer from "inquirer";
var jsonQuery = require('json-query')

const CUR_DIR = process.cwd();
const QUESTIONS = [
    {
        name: "crud-name",
        type: "input",
        message: "Enter Entity name:",
    },
];

const generateCrud = async () => {

    const answers = await inquirer.prompt(QUESTIONS);
    const entityName = answers["crud-name"];


    const templatePath = `${CUR_DIR}/generator/controller`;
    const schemaPath = `${CUR_DIR}/prisma/schema.prisma`;

    const controllerPath = `${templatePath}/controller`;
    let schemaContents = fs.readFileSync(schemaPath, "utf8");
    var regexModel = new RegExp('((model)(\\s+)('+entityName+'){1}(\\s*)({){1})');
    var r  = schemaContents.match(regexModel);
    var startIndex = r.index;
    var endIndex = schemaContents.indexOf('}', startIndex)
    var content = schemaContents.substring(startIndex, endIndex).replace(r[0],'');
    var lines = content.split('\n');
    var fields = [];
    var commonDatatypes = ['Int','Float','Boolean','String'];
    for(const line of lines)
    {
        var reg = new RegExp(/((\w+)\s+(\w+\?{0,1}(\[\]){0,1}))(.*)/);
        var matches  = line.match(reg); // 2,3,5
        if(matches)
        {
            var fieldName = matches[2].trim();
            var dataType = matches[3].trim();
            var others = matches[5].trim();
            if(fieldName == "ID") continue;
            fields.push({
                Name : fieldName, 
                IsMandatory : dataType.indexOf('?')>0?false:true,
                DataType : dataType.replace('?',''),
                IsObjectReference : fieldName.endsWith("ID")?true:false,
                IsObject : commonDatatypes.includes(dataType.replace('?',''))?false:true,
                IsReverseReference : dataType.indexOf('[]')>0?true:false,
            });
            console.log(fieldName +"|" + dataType);
        }
    }
};

generateCrud();


/*
(model)(\s+)(\w*)(\s*)({){1}(((\s+)(\w+)(\s+)(\w+))((\n)|((\s+)(@id){0,1}(\s+)(@default(autoincrement())){0,1}(@db.(SmallInt))*)))+

*/


var uiBasicListAdd = 
{
    ModelName: "EBeatLocation",
    PageTitle: "E-Beat Location",
    ListView:
    {
        SearchColumns:[
            "Name",
            "Address"
        ],
        ColumnsToShow: [
            "Name",
            "EBeatLocationType.Name",
            "Address"
        ],
        SortColumns:[
            "Name",
            "EBeatLocationType.Name"
        ],
        Filters:[
            "EBeatLocationType",
            "CreatedAtStation" // Cascading later
        ],
        RowActionButtons:{
            Edit: true,
            View: true,
            Delete: true
        },
        CustomActionButtons:[
            {
                Icon:"iconURL",
                Target: "self/blank", //popup later
                Href : "url/{id}"
            }
        ],
        Paginated: true,
        PageSize:[10,25,50,100]
    },
    AddEditView:{
        MandatoryFields: [
            "Name",
            "EBeatLocationType",
            "Address"
        ],
        OptionalFields: [

        ],
    }
};

// model EBeatLocation {
//     Name                String
//     EBeatLocationTypeID Int               @db.SmallInt
//     CreatedByID         Int               @db.SmallInt
//     CreatedAtStationID  Int               @db.SmallInt
//     Address             String
//     Lat                 Float?
//     Long                Float?
//     ActivatedDateTime   DateTime?         @db.Timetz(6)
//     ActivatedByID       Int?              @db.SmallInt
//     EBeatLocationQR     String?           @db.Uuid
//     IsDeleted           Boolean?          @default(false)
//     ID                  Int               @id @default(autoincrement()) @db.SmallInt
//     CreationDateTime    DateTime?         @db.Timestamptz(6)
//     ActivatedBy         Officer?          @relation("EBeatLocation_ActivatedByIDToOfficer", fields: [ActivatedByID], references: [ID])
//     CreatedAtStation    Office            @relation(fields: [CreatedAtStationID], references: [ID])
//     CreatedBy           User              @relation(fields: [CreatedByID], references: [ID])
//     EBeatLocationType   EBeatLocationType @relation(fields: [EBeatLocationTypeID], references: [ID])
//     EBeatCheckin        EBeatCheckin[]
  
//     @@index([ActivatedByID], name: "fki_EBeatLocationActivatedBy")
//     @@index([CreatedAtStationID], name: "fki_EBeatLocationCreatedAt")
//     @@index([CreatedByID], name: "fki_EBeatLocationCreatedBy")
//     @@index([EBeatLocationTypeID], name: "fki_EBeatLocationType")
//   }
  