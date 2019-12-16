import { EventEmitter } from "events";
import * as util from "util";
import * as java from "java";
import * as winston from "winston";

java["async" + "Options"] = {
    asyncSuffix: "",
    syncSuffix: "Sync",
    promiseSuffix: "$",
    promisify: util.promisify
};

export namespace Jinst {
    export function isJvmCreated() {
        return java.isJvmCreated();
    }

    export function addOption(option) {
        if (!isJvmCreated() && option) {
            java.options.push(option);
        } else if (isJvmCreated()) {
            winston.error(
                "You've tried to add an option to an already running JVM!"
            );
            winston.error(
                "This isn't currently supported.  Please add all option entries before calling any java methods"
            );
            winston.error(
                "You can test for a running JVM with the isJvmCreated funtion."
            );
        }
    }

    export function setupClasspath(dependencyArr) {
        if (!isJvmCreated() && dependencyArr) {
            java.classpath.push.apply(java.classpath, dependencyArr);
        } else if (isJvmCreated()) {
            winston.error(
                "You've tried to add an entry to the classpath of an already running JVM!"
            );
            winston.error(
                "This isn't currently supported.  Please add all classpath entries before calling any java methods"
            );
            winston.error(
                "You can test for a running JVM with the isJvmCreated funtion."
            );
        }
    }

    export function getInstance() {
        return java;
    }

    export let events = new EventEmitter();
}

export default Jinst;
