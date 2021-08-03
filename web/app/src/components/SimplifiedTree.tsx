import React from 'react'
import {FaDatabase, FaFolder, FaFolderOpen, FaRegFileAlt, FaRegFolder} from "react-icons/fa";

type SimplifiedTreeProps = {
    packages: any
    datasourceId: string
    documentName: string
}



export const SimplifiedTree = (props: SimplifiedTreeProps) => {
    console.log("props in simpleified tree", props.packages)

    let packageList: any[] = []

    return (<div>
        <div><FaDatabase style={{ color: 'gray' }}  /> {props.datasourceId}</div>
        {props.packages.map((package_: any, index: number) =>
            {
                return <div style={{paddingLeft: 20*(index+1), paddingTop: 10}}> {package_.is_root ? <FaFolderOpen style={{ color: '#8531A3' }} /> : <FaFolderOpen />  }   {package_.package_name}</div>
            })
        }
        <div style={{paddingLeft: 20*(props.packages.length+1), paddingTop: 10, paddingBottom: 20}} ><FaRegFileAlt /> {props.documentName}</div>


    </div>)
}

