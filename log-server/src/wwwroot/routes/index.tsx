import Inject from "@entity-access/entity-access/dist/di/di.js";
import Page from "@entity-access/server-pages/dist/Page.js";
import DBConfig, { UIPackageConfig } from "../../model/DBConfig.js";
import Content, { FileResult } from "@entity-access/server-pages/dist/Content.js";
import HtmlDocument from "@entity-access/server-pages/dist/html/HtmlDocument.js";
import WebAtomsLogo from "@entity-access/server-pages/dist/html/WebAtomsLogo.js";
import XNode from "@entity-access/server-pages/dist/html/XNode.js";
import { ImagesFolder } from "../../ImagesFolder.js";


export default class extends Page {

    @Inject
    config: DBConfig;

    req: any;

    async run() {

        const file = this.childPath[0];

        if (file && file.startsWith("robots") && file.endsWith(".txt")) {
            return this.notFound();
        }

        if (file === "favicon.ico") {
            return new FileResult(ImagesFolder.file("favicon.ico"));
        }

        const uiPackage = await this.config.get(UIPackageConfig);

        const uiVersion = this.query?.["ui-version"] ?? uiPackage.version;

        // const packageRoot = `https://unpkg.com/${uiPackage.package}@${uiVersion}`;
        const packageRoot = `https://cdn.jsdelivr.net/npm/${uiPackage.package}@${uiVersion}`;

        const serverPackage = process.env.npm_package_name;
        const serverPackageVersion = process.env.npm_package_version;

        const moduleInfo = JSON.stringify({
            ui: {
                package: uiPackage,
                version: uiVersion
            },
            server: {
                package: serverPackage,
                version: serverPackageVersion
            }
        });

        return Content.html(<HtmlDocument>
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, shrink-to-fit=YES, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                <title>Tracer</title>
                <script>
                    var moduleInfo = {moduleInfo};
                </script>
                <link rel="manifest" href="/pwa/manifest.json"/>
                <style>
                    {`html, body {
                        height: 100vh;
                        width: 100vw;
                        margin: 0;
                    }`}
                </style>
            </head>
            <body>
                <WebAtomsLogo/>
                <div id="webAtomsLoader" style="height: 100%;width: 100%; display: flex; align-items: center; justify-content: center;">
                    <div style="padding: 10px; border-radius: 10px; background-color: dodgerblue; color: white;">
                        Loading...
                    </div>
                </div>

                <script
                    data-package={uiPackage.package}
                    data-package-root={packageRoot}
                    data-view={uiPackage.view}
                    src={`${packageRoot}/index.js`}
                    ></script>
            </body>
        </HtmlDocument>);
    }

}
