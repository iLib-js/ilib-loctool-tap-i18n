/*
 * YamlFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright © 2016-2017, 2023 2021- 2022-2023 HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if (!YamlFileType) {
    var YamlFileType = require("../YamlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}
var path = require("path");

var projectWithMappings = new CustomProject({
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "YamlFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    tap: {
        mappings: {
            "foo.yml": {
                template: "res/[locale]/foo.yml"
            },
            "**/*.y?(a)ml": {
                template: "resources/[locale]/[filename]"
            },
            "**/strings.yaml": {
                template: "[dir]/strings.[locale].yaml"
            },
            "**/test/strings.y?(a)ml": {
                template: "[dir]/[basename]/[locale].[extension]"
            }
        }
    }
});

var legacyProject = new CustomProject({
    sourceLocale: "en-US",
    resourceDirs: {
        "yml": "config/locales"
    },
    plugins: [
        path.join(process.cwd(), "YamlFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"]
});

var legacyProjectWithFlavor = new CustomProject({
    sourceLocale: "en-US",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
    locales:["en-GB"],
    flavors: ["ASDF"]
});

describe("yamlfiletype projectWithMappingsTests", function() {
    test("YamlFileTypeConstructor", function() {
        expect.assertions(1);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
    });

    test("YamlFileTypeHandlesYml", function() {
        expect.assertions(2);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("foo.yml")).toBeTruthy();
    });

    test("YamlFileTypeHandlesYaml", function() {
        expect.assertions(2);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("foo.yaml")).toBeTruthy();
    });

    test("YamlFileTypeHandlesAnythingFalse", function() {
        expect.assertions(4);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("foo.tmpl.html")).toBeFalsy();
        expect(yft.handles("foo.html.haml")).toBeFalsy();
        expect(yft.handles("foo.js")).toBeFalsy();
    });

    test("YamlFileTypeHandlesNoResourceFiles", function() {
        expect.assertions(2);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("res/ru-RU/foo.yml")).toBeFalsy();
    });

    test("YamlFileTypeHandlesSourceLocaleFilesInSubfolders", function() {
        expect.assertions(2);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("subfolder/strings.en-US.yaml")).toBeTruthy();
    });

    test("YamlFileTypeHandlesNoLocalizedFilesInSubfolders", function() {
        expect.assertions(2);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("subfolder/strings.ru-RU.yaml")).toBeFalsy();
    });

    test("YamlFileTypeHandlesFilesNamedForALocale", function() {
        expect.assertions(4);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("en-US.yml")).toBeTruthy();
        expect(yft.handles("de-DE.yml")).toBeTruthy();
        expect(yft.handles("en.yml")).toBeTruthy();
    });

    test("YamlFileTypeHandlesResourceFilesInSubdirs", function() {
        expect.assertions(2);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("res/ru-RU/foo.yml")).toBeFalsy();
    });

    test("YamlFileTypeHandlesBasenameDirMapping", function() {
        expect.assertions(3);
        var yft = new YamlFileType(projectWithMappings);
        expect(yft).toBeTruthy();
        expect(yft.handles("test/strings.yaml")).toBeTruthy();
        expect(yft.handles("test/strings/ru-RU.yaml")).toBeFalsy();
    });
});
