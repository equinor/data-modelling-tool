import React, { useEffect, useState } from 'react'
import IndexProvider from "../context/global-index/IndexProvider";
import {IDashboard, useDashboard} from "../context/dashboard/DashboardProvider";
import {IndexAPI} from "@dmt/common";
import SimpleDocumentExplorer from "../pages/editor/document-explorer/SimpleDocumentExplorer";

const indexAPI = new IndexAPI()

type SimpleTreeViewProps = {
    document: any
}

export const SimpleTreeView = (props: SimpleTreeViewProps) => {
    const dashboard: IDashboard = useDashboard()
    return <div>
        <IndexProvider dataSources={dashboard.models.dataSources.models.dataSources} indexApi={indexAPI}>
            <SimpleDocumentExplorer document={props.document} />
        </IndexProvider>
    </div>
}