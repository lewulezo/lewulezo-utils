import { ResultSet } from "./ResultSet";
import { Connection } from "./Connection";
import { Jinst } from "./Jinst";

const java = Jinst.getInstance();

export class DatabaseMetaData {
    private _dbm;

    constructor(dbm) {
        this._dbm = dbm;
    }

    async getSchemas(
        catalog?: string,
        schemaPattern?: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getSchemas$(...arguments);
        return new ResultSet(rs);
    }

    async getTables(
        catalog: string,
        schemaPattern: string,
        tableNamePattern: string,
        types: string[]
    ): Promise<ResultSet> {
        let rs = await this._dbm.getTables$(...arguments);
        return new ResultSet(rs);
    }

    async allProceduresAreCallable(): Promise<boolean> {
        return await this._dbm.allProceduresAreCallable$();
    }

    async allTablesAreSelectable(): Promise<boolean> {
        return await this._dbm.allTablesAreSelectable$();
    }

    async autoCommitFailureClosesAllResultSets(): Promise<boolean> {
        return await this._dbm.autoCommitFailureClosesAllResultSets$();
    }

    async dataDefinitionCausesTransactionCommit(): Promise<boolean> {
        return this._dbm.dataDefinitionCausesTransactionCommit$();
    }

    async dataDefinitionIgnoredInTransactions(): Promise<boolean> {
        return this._dbm.dataDefinitionIgnoredInTransactions$();
    }

    async deletesAreDetected(type: number): Promise<boolean> {
        return await this._dbm.deletesAreDetected$(type);
    }

    async doesMaxRowSizeIncludeBlobs(): Promise<boolean> {
        return await this._dbm.doesMaxRowSizeIncludeBlobs$();
    }

    async generatedKeyAlwaysReturned(): Promise<boolean> {
        return await this._dbm.generatedKeyAlwaysReturned$();
    }

    async getAttributes(
        catalog: string,
        schemaPattern: string,
        typeNamePattern: string,
        attributeNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getAttributes$(...arguments);
        return new ResultSet(rs);
    }

    async getBestRowIdentifier(
        catalog: string,
        schema: string,
        table: string,
        scope: number,
        nullable: boolean
    ): Promise<ResultSet> {
        let rs = await this._dbm.getBestRowIdentifier$(...arguments);
        return new ResultSet(rs);
    }

    async getCatalogs(): Promise<ResultSet> {
        let rs = this._dbm.getCatalogs$();
        return new ResultSet(rs);
    }

    async getCatalogSeparator(): Promise<string> {
        return await this._dbm.getCatalogSeparator$();
    }

    async getCatalogTerm(): Promise<string> {
        return await this._dbm.getCatalogTerm$();
    }

    async getClientInfoProperties(): Promise<ResultSet> {
        let rs = await this._dbm.getClientInfoProperties$();
        return new ResultSet(rs);
    }

    async getColumnPrivileges(
        catalog: string,
        schema: string,
        table: string,
        columnNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getColumnPrivileges$(...arguments);
        return new ResultSet(rs);
    }

    async getColumns(
        catalog: string,
        schemaPattern: string,
        tableNamePattern: string,
        columnNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getColumns$(...arguments);
        return new ResultSet(rs);
    }

    async getConnection(): Promise<Connection> {
        let conn = await this._dbm.getConnection$();
        return new Connection(conn);
    }

    async getCrossReference(
        parentCatalog: string,
        parentSchema: string,
        parentTable: string,
        foreignCatalog: string,
        foreignSchema: string,
        foreignTable: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getCrossReference$(...arguments);
        return new ResultSet(rs);
    }

    async getDatabaseMajorVersion(): Promise<number> {
        return await this._dbm.getDatabaseMajorVersion$();
    }

    async getDatabaseMinorVersion(): Promise<number> {
        return await this._dbm.getDatabaseMinorVersion$();
    }

    async getDatabaseProductName(): Promise<string> {
        return await this._dbm.getDatabaseProductName$();
    }

    async getDatabaseProductVersion(): Promise<string> {
        return await this._dbm.getDatabaseProductVersion$();
    }

    async getDefaultTransactionIsolation(): Promise<number> {
        return await this._dbm.getDefaultTransactionIsolation$();
    }

    async getDriverMajorVersion(): Promise<number> {
        return await this._dbm.getDriverMajorVersion$();
    }

    async getDriverMinorVersion(): Promise<number> {
        return await this._dbm.getDriverMinorVersion$();
    }

    async getDriverName(): Promise<string> {
        return await this._dbm.getDriverName$();
    }

    async getDriverVersion(): Promise<string> {
        return await this._dbm.getDriverVersion$();
    }

    async getExportedKeys(
        catalog: string,
        schema: string,
        table: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getExportedKeys$(...arguments);
        return new ResultSet(rs);
    }

    async getExtraNameCharacters(): Promise<string> {
        return await this._dbm.getExtraNameCharacters$();
    }

    async getFunctionColumns(
        catalog: string,
        schemaPattern: string,
        functionNamePattern: string,
        columnNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getFunctionColumns$(...arguments);
        return new ResultSet(rs);
    }

    async getFunctions(
        catalog: string,
        schemaPattern: string,
        functionNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getFunctions$(...arguments);
        return new ResultSet(rs);
    }

    async getIdentifierQuoteString(): Promise<string> {
        return await this._dbm.getIdentifierQuoteString$();
    }

    async getImportedKeys(
        catalog: string,
        schema: string,
        table: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getImportedKeys$(...arguments);
        return new ResultSet(rs);
    }

    async getIndexInfo(
        catalog: string,
        schema: string,
        table: string,
        unique: boolean,
        approximate: boolean
    ): Promise<ResultSet> {
        let rs = await this._dbm.getIndexInfo$(...arguments);
        return new ResultSet(rs);
    }

    async getJDBCMajorVersion(): Promise<number> {
        return await this._dbm.getJDBCMajorVersion$();
    }

    async getJDBCMinorVersion(): Promise<number> {
        return await this._dbm.getJDBCMinorVersion$();
    }

    async getMaxBinaryLiteralLength(): Promise<number> {
        return await this._dbm.getMaxBinaryLiteralLength$();
    }

    async getMaxCatalogNameLength(): Promise<number> {
        return await this._dbm.getMaxCatalogNameLength$();
    }

    async getMaxCharLiteralLength(): Promise<number> {
        return await this._dbm.getMaxCharLiteralLength$();
    }

    async getMaxColumnNameLength(): Promise<number> {
        return await this._dbm.getMaxColumnNameLength$();
    }

    async getMaxColumnsInGroupBy(): Promise<number> {
        return await this._dbm.getMaxColumnsInGroupBy$();
    }

    async getMaxColumnsInIndex(): Promise<number> {
        return await this._dbm.getMaxColumnsInIndex$();
    }

    async getMaxColumnsInOrderBy(): Promise<number> {
        return await this._dbm.getMaxColumnsInOrderBy$();
    }

    async getMaxColumnsInSelect(): Promise<number> {
        return await this._dbm.getMaxColumnsInSelect$();
    }

    async getMaxColumnsInTable(): Promise<number> {
        return await this._dbm.getMaxColumnsInTable$();
    }

    async getMaxConnections(): Promise<number> {
        return await this._dbm.getMaxConnections$();
    }

    async getMaxCursorNameLength(): Promise<number> {
        return await this._dbm.getMaxCursorNameLength$();
    }

    async getMaxIndexLength(): Promise<number> {
        return await this._dbm.getMaxIndexLength$();
    }

    async getMaxProcedureNameLength(): Promise<number> {
        return await this._dbm.getMaxProcedureNameLength$();
    }

    async getMaxRowSize(): Promise<number> {
        return await this._dbm.getMaxRowSize$();
    }

    async getMaxSchemaNameLength(): Promise<number> {
        return await this._dbm.getMaxSchemaNameLength$();
    }

    async getMaxStatementLength(): Promise<number> {
        return await this._dbm.getMaxStatementLength$();
    }

    async getMaxStatements(): Promise<number> {
        return await this._dbm.getMaxStatements$();
    }

    async getMaxTableNameLength(): Promise<number> {
        return await this._dbm.getMaxTableNameLength$();
    }

    async getMaxTablesInSelect(): Promise<number> {
        return await this._dbm.getMaxTablesInSelect$();
    }

    async getMaxUserNameLength(): Promise<number> {
        return await this._dbm.getMaxUserNameLength$();
    }

    async getNumericFunctions(): Promise<string> {
        return await this._dbm.getNumericFunctions$();
    }

    async getPrimaryKeys(
        catalog: string,
        schema: string,
        table: string
    ): Promise<ResultSet> {
        let res = await this._dbm.getPrimaryKeys$(catalog, schema, table);
        return new ResultSet(res);
    }

    async getProcedureColumns(
        catalog: string,
        schemaPattern: string,
        procedureNamePattern: string,
        columnNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getProcedureColumns$(
            catalog,
            schemaPattern,
            procedureNamePattern,
            columnNamePattern
        );
        return new ResultSet(rs);
    }

    async getProcedures(
        catalog: string,
        schemaPattern: string,
        procedureNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getProcedures$(
            catalog,
            schemaPattern,
            procedureNamePattern
        );
        return new ResultSet(rs);
    }

    async getProcedureTerm(): Promise<string> {
        return await this._dbm.getProcedureTerm$();
    }

    async getPseudoColumns(
        catalog: string,
        schemaPattern: string,
        tableNamePattern: string,
        columnNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getPseudoColumns$(
            catalog,
            schemaPattern,
            tableNamePattern,
            columnNamePattern
        );
        return new ResultSet(rs);
    }

    async getResultSetHoldability(): Promise<number> {
        return await this._dbm.getResultSetHoldability$();
    }

    async getRowIdLifetime() {
        return await this._dbm.getRowIdLifetime$();
    }

    async getSchemaTerm(): Promise<string> {
        return await this._dbm.getSchemaTerm$();
    }

    async getSearchStringEscape(): Promise<string> {
        return await this._dbm.getSearchStringEscape$();
    }

    async getSQLKeywords(): Promise<string> {
        return await this._dbm.getSQLKeywords$();
    }

    async getSQLStateType(): Promise<number> {
        return await this._dbm.getSQLStateType$();
    }

    async getStringFunctions(): Promise<string> {
        return await this._dbm.getStringFunctions$();
    }

    async getSuperTables(
        catalog: string,
        schemaPattern: string,
        tableNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getSuperTables$(
            catalog,
            schemaPattern,
            tableNamePattern
        );
        return new ResultSet(rs);
    }

    async getSuperTypes(
        catalog: string,
        schemaPattern: string,
        typeNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getSuperTypes$(
            catalog,
            schemaPattern,
            typeNamePattern
        );
        return new ResultSet(rs);
    }

    async getSystemFunctions(): Promise<string> {
        return await this._dbm.getSystemFunctions$();
    }

    async getTablePrivileges(
        catalog: string,
        schemaPattern: string,
        tableNamePattern: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getTablePrivileges$(
            catalog,
            schemaPattern,
            tableNamePattern
        );
        return new ResultSet(rs);
    }

    async getTableTypes(): Promise<ResultSet> {
        let rs = await this._dbm.getTableTypes$();
        return new ResultSet(rs);
    }

    async getTimeDateFunctions(): Promise<string> {
        return await this._dbm.getTimeDateFunctions$();
    }

    async getTypeInfo(): Promise<ResultSet> {
        let rs = await this._dbm.getTypeInfo$();
        return new ResultSet(rs);
    }

    async getUDTs(
        catalog: string,
        schemaPattern: string,
        typeNamePattern: string,
        types: number[]
    ): Promise<ResultSet> {
        let rs = await this._dbm.getUDTs$(
            catalog,
            schemaPattern,
            typeNamePattern,
            types
        );
        return new ResultSet(rs);
    }

    async getURL(): Promise<string> {
        return await this._dbm.getURL$();
    }

    async getUserName(): Promise<string> {
        return await this._dbm.getUserName$();
    }

    async getVersionColumns(
        catalog: string,
        schema: string,
        table: string
    ): Promise<ResultSet> {
        let rs = await this._dbm.getVersionColumns$(catalog, schema, table);
        return new ResultSet(rs);
    }

    async insertsAreDetected(type: number): Promise<boolean> {
        return await this._dbm.insertsAreDetected$(type);
    }

    async isCatalogAtStart(): Promise<boolean> {
        return await this._dbm.isCatalogAtStart$();
    }

    async isReadOnly(): Promise<boolean> {
        return await this._dbm.isReadOnly$();
    }

    async locatorsUpdateCopy(): Promise<boolean> {
        return await this._dbm.locatorsUpdateCopy$();
    }

    async nullPlusNonNullIsNull(): Promise<boolean> {
        return await this._dbm.nullPlusNonNullIsNull$();
    }

    async nullsAreSortedAtEnd(): Promise<boolean> {
        return await this._dbm.nullsAreSortedAtEnd$();
    }

    async nullsAreSortedAtStart(): Promise<boolean> {
        return await this._dbm.nullsAreSortedAtStart$();
    }

    async nullsAreSortedHigh(): Promise<boolean> {
        return await this._dbm.nullsAreSortedHigh$();
    }

    async nullsAreSortedLow(): Promise<boolean> {
        return await this._dbm.nullsAreSortedLow$();
    }

    async othersDeletesAreVisible(type: number): Promise<boolean> {
        return await this._dbm.othersDeletesAreVisible$(type);
    }

    async othersInsertsAreVisible(type: number): Promise<boolean> {
        return await this._dbm.othersInsertsAreVisible$(type);
    }

    async othersUpdatesAreVisible(type: number): Promise<boolean> {
        return await this._dbm.othersUpdatesAreVisible$(type);
    }

    async ownDeletesAreVisible(type: number): Promise<boolean> {
        return await this._dbm.ownDeletesAreVisible$(type);
    }

    async ownInsertsAreVisible(type: number): Promise<boolean> {
        return await this._dbm.ownInsertsAreVisible$(type);
    }

    async ownUpdatesAreVisible(type: number): Promise<boolean> {
        return await this._dbm.ownUpdatesAreVisible$(type);
    }

    async storesLowerCaseIdentifiers(): Promise<boolean> {
        return await this._dbm.storesLowerCaseIdentifiers$();
    }

    async storesLowerCaseQuotedIdentifiers(): Promise<boolean> {
        return await this._dbm.storesLowerCaseQuotedIdentifiers$();
    }

    async storesMixedCaseIdentifiers(): Promise<boolean> {
        return await this._dbm.storesMixedCaseIdentifiers$();
    }

    async storesMixedCaseQuotedIdentifiers(): Promise<boolean> {
        return await this._dbm.storesMixedCaseQuotedIdentifiers$();
    }

    async storesUpperCaseIdentifiers(): Promise<boolean> {
        return await this._dbm.storesUpperCaseIdentifiers$();
    }

    async storesUpperCaseQuotedIdentifiers(): Promise<boolean> {
        return await this._dbm.storesUpperCaseQuotedIdentifiers$();
    }

    async supportsAlterTableWithAddColumn(): Promise<boolean> {
        return await this._dbm.supportsAlterTableWithAddColumn$();
    }

    async supportsAlterTableWithDropColumn(): Promise<boolean> {
        return await this._dbm.supportsAlterTableWithDropColumn$();
    }

    async supportsANSI92EntryLevelSQL(): Promise<boolean> {
        return await this._dbm.supportsANSI92EntryLevelSQL$();
    }

    async supportsANSI92FullSQL(): Promise<boolean> {
        return await this._dbm.supportsANSI92FullSQL$();
    }

    async supportsANSI92IntermediateSQL(): Promise<boolean> {
        return await this._dbm.supportsANSI92IntermediateSQL$();
    }

    async supportsBatchUpdates(): Promise<boolean> {
        return await this._dbm.supportsBatchUpdates$();
    }

    async supportsCatalogsInDataManipulation(): Promise<boolean> {
        return await this._dbm.supportsCatalogsInDataManipulation$();
    }

    async supportsCatalogsInIndexDefinitions(): Promise<boolean> {
        return await this._dbm.supportsCatalogsInIndexDefinitions$();
    }

    async supportsCatalogsInPrivilegeDefinitions(): Promise<boolean> {
        return await this._dbm.supportsCatalogsInPrivilegeDefinitions$();
    }

    async supportsCatalogsInProcedureCalls(): Promise<boolean> {
        return await this._dbm.supportsCatalogsInProcedureCalls$();
    }

    async supportsCatalogsInTableDefinitions(): Promise<boolean> {
        return await this._dbm.supportsCatalogsInTableDefinitions$();
    }

    async supportsColumnAliasing(): Promise<boolean> {
        return await this._dbm.supportsColumnAliasing$();
    }

    async supportsConvert(fromType: number, toType: number): Promise<boolean> {
        return await this._dbm.supportsConvert$(fromType, toType);
    }

    async supportsCoreSQLGrammar(): Promise<boolean> {
        return await this._dbm.supportsCoreSQLGrammar$();
    }

    async supportsCorrelatedSubqueries(): Promise<boolean> {
        return await this._dbm.supportsCorrelatedSubqueries$();
    }

    async supportsDataDefinitionAndDataManipulationTransactions(): Promise<
        boolean
    > {
        return await this._dbm.supportsDataDefinitionAndDataManipulationTransactions$();
    }

    async supportsDataManipulationTransactionsOnly(): Promise<boolean> {
        return await this._dbm.supportsDataManipulationTransactionsOnly$();
    }

    async supportsDifferentTableCorrelationNames(): Promise<boolean> {
        return await this._dbm.supportsDifferentTableCorrelationNames$();
    }

    async supportsExpressionsInOrderBy(): Promise<boolean> {
        return await this._dbm.supportsExpressionsInOrderBy$();
    }

    async supportsExtendedSQLGrammar(): Promise<boolean> {
        return await this._dbm.supportsExtendedSQLGrammar$();
    }

    async supportsFullOuterJoins(): Promise<boolean> {
        return await this._dbm.supportsFullOuterJoins$();
    }

    async supportsGetGeneratedKeys(): Promise<boolean> {
        return await this._dbm.supportsGetGeneratedKeys$();
    }

    async supportsGroupBy(): Promise<boolean> {
        return await this._dbm.supportsGroupBy$();
    }

    async supportsGroupByBeyondSelect(): Promise<boolean> {
        return await this._dbm.supportsGroupByBeyondSelect$();
    }

    async supportsGroupByUnrelated(): Promise<boolean> {
        return await this._dbm.supportsGroupByUnrelated$();
    }

    async supportsIntegrityEnhancementFacility(): Promise<boolean> {
        return await this._dbm.supportsIntegrityEnhancementFacility$();
    }

    async supportsLikeEscapeClause(): Promise<boolean> {
        return await this._dbm.supportsLikeEscapeClause$();
    }

    async supportsLimitedOuterJoins(): Promise<boolean> {
        return await this._dbm.supportsLimitedOuterJoins$();
    }

    async supportsMinimumSQLGrammar(): Promise<boolean> {
        return await this._dbm.supportsMinimumSQLGrammar$();
    }

    async supportsMixedCaseIdentifiers(): Promise<boolean> {
        return await this._dbm.supportsMixedCaseIdentifiers$();
    }

    async supportsMixedCaseQuotedIdentifiers(): Promise<boolean> {
        return await this._dbm.supportsMixedCaseQuotedIdentifiers$();
    }

    async supportsMultipleOpenResults(): Promise<boolean> {
        return await this._dbm.supportsMultipleOpenResults$();
    }

    async supportsMultipleResultSets(): Promise<boolean> {
        return await this._dbm.supportsMultipleResultSets$();
    }

    async supportsMultipleTransactions(): Promise<boolean> {
        return await this._dbm.supportsMultipleTransactions$();
    }

    async supportsNamedParameters(): Promise<boolean> {
        return await this._dbm.supportsNamedParameters$();
    }

    async supportsNonNullableColumns(): Promise<boolean> {
        return await this._dbm.supportsNonNullableColumns$();
    }

    async supportsOpenCursorsAcrossCommit(): Promise<boolean> {
        return await this._dbm.supportsOpenCursorsAcrossCommit$();
    }

    async supportsOpenCursorsAcrossRollback(): Promise<boolean> {
        return await this._dbm.supportsOpenCursorsAcrossRollback$();
    }

    async supportsOpenStatementsAcrossCommit(): Promise<boolean> {
        return await this._dbm.supportsOpenStatementsAcrossCommit$();
    }

    async supportsOpenStatementsAcrossRollback(): Promise<boolean> {
        return await this._dbm.supportsOpenStatementsAcrossRollback$();
    }

    async supportsOrderByUnrelated(): Promise<boolean> {
        return await this._dbm.supportsOrderByUnrelated$();
    }

    async supportsOuterJoins(): Promise<boolean> {
        return await this._dbm.supportsOuterJoins$();
    }

    async supportsPositionedDelete(): Promise<boolean> {
        return await this._dbm.supportsPositionedDelete$();
    }

    async supportsPositionedUpdate(): Promise<boolean> {
        return await this._dbm.supportsPositionedUpdate$();
    }

    async supportsResultSetConcurrency(
        type: number,
        concurrency: number
    ): Promise<boolean> {
        return await this._dbm.supportsResultSetConcurrency$(type, concurrency);
    }

    async supportsResultSetHoldability(holdability: number): Promise<boolean> {
        return await this._dbm.supportsResultSetHoldability$(holdability);
    }

    async supportsResultSetType(type: number): Promise<boolean> {
        return await this._dbm.supportsResultSetType$(type);
    }

    async supportsSavepoints(): Promise<boolean> {
        return await this._dbm.supportsSavepoints$();
    }

    async supportsSchemasInDataManipulation(): Promise<boolean> {
        return await this._dbm.supportsSchemasInDataManipulation$();
    }

    async supportsSchemasInIndexDefinitions(): Promise<boolean> {
        return await this._dbm.supportsSchemasInIndexDefinitions$();
    }

    async supportsSchemasInPrivilegeDefinitions(): Promise<boolean> {
        return await this._dbm.supportsSchemasInPrivilegeDefinitions$();
    }

    async supportsSchemasInProcedureCalls(): Promise<boolean> {
        return await this._dbm.supportsSchemasInProcedureCalls$();
    }

    async supportsSchemasInTableDefinitions(): Promise<boolean> {
        return await this._dbm.supportsSchemasInTableDefinitions$();
    }

    async supportsSelectForUpdate(): Promise<boolean> {
        return await this._dbm.supportsSelectForUpdate$();
    }

    async supportsStatementPooling(): Promise<boolean> {
        return await this._dbm.supportsStatementPooling$();
    }

    async supportsStoredFunctionsUsingCallSyntax(): Promise<boolean> {
        return await this._dbm.supportsStoredFunctionsUsingCallSyntax$();
    }

    async supportsStoredProcedures(): Promise<boolean> {
        return await this._dbm.supportsStoredProcedures$();
    }

    async supportsSubqueriesInComparisons(): Promise<boolean> {
        return await this._dbm.supportsSubqueriesInComparisons$();
    }

    async supportsSubqueriesInExists(): Promise<boolean> {
        return await this._dbm.supportsSubqueriesInExists$();
    }

    async supportsSubqueriesInIns(): Promise<boolean> {
        return await this._dbm.supportsSubqueriesInIns$();
    }

    async supportsSubqueriesInQuantifieds(): Promise<boolean> {
        return await this._dbm.supportsSubqueriesInQuantifieds$();
    }

    async supportsTableCorrelationNames(): Promise<boolean> {
        return await this._dbm.supportsTableCorrelationNames$();
    }

    async supportsTransactionIsolationLevel(level: number): Promise<boolean> {
        return await this._dbm.supportsTransactionIsolationLevel$(level);
    }

    async supportsTransactions(): Promise<boolean> {
        return await this._dbm.supportsTransactions$();
    }

    async supportsUnion(): Promise<boolean> {
        return await this._dbm.supportsUnion$();
    }

    async supportsUnionAll(): Promise<boolean> {
        return await this._dbm.supportsUnionAll$();
    }

    async updatesAreDetected(type: number): Promise<boolean> {
        return await this._dbm.updatesAreDetected$(type);
    }

    async usesLocalFilePerTable(): Promise<boolean> {
        return await this._dbm.usesLocalFilePerTable$();
    }

    async usesLocalFiles(): Promise<boolean> {
        return await this._dbm.usesLocalFiles$();
    }
}

Jinst.events.once("initialized", function onInitialized() {
    // See https://docs.oracle.com/javase/7/docs/api/java/sql/DatabaseMetaData.html
    // for full documentation for static attributes
    var staticAttrs = [
        "attributeNoNulls",
        "attributeNullable",
        "attributeNullableUnknown",
        "bestRowNotPseudo",
        "bestRowPseudo",
        "bestRowSession",
        "bestRowTemporary",
        "bestRowTransaction",
        "bestRowUnknown",
        "columnNoNulls",
        "columnNullable",
        "columnNullableUnknown",
        "functionColumnIn",
        "functionColumnInOut",
        "functionColumnOut",
        "functionColumnResult",
        "functionColumnUnknown",
        "functionNoNulls",
        "functionNoTable",
        "functionNullable",
        "functionNullableUnknown",
        "functionResultUnknown",
        "functionReturn",
        "functionReturnsTable",
        "importedKeyCascade",
        "importedKeyInitiallyDeferred",
        "importedKeyInitiallyImmediate",
        "importedKeyNoAction",
        "importedKeyNotDeferrable",
        "importedKeyRestrict",
        "importedKeySetDefault",
        "importedKeySetNull",
        "procedureColumnIn",
        "procedureColumnInOut",
        "procedureColumnOut",
        "procedureColumnResult",
        "procedureColumnReturn",
        "procedureColumnUnknown",
        "procedureNoNulls",
        "procedureNoResult",
        "procedureNullable",
        "procedureNullableUnknown",
        "procedureResultUnknown",
        "procedureReturnsResult",
        "sqlStateSQL",
        "sqlStateSQL99",
        "sqlStateXOpen",
        "tableIndexClustered",
        "tableIndexHashed",
        "tableIndexOther",
        "tableIndexStatistic",
        "typeNoNulls",
        "typeNullable",
        "typeNullableUnknown",
        "typePredBasic",
        "typePredChar",
        "typePredNone",
        "typeSearchable",
        "versionColumnNotPseudo",
        "versionColumnPseudo",
        "versionColumnUnknown"
    ];

    staticAttrs.forEach(function(attr) {
        DatabaseMetaData[attr] = java.getStaticFieldValue(
            "java.sql.DatabaseMetaData",
            attr
        );
    });
});
