pragma solidity ^0.4.22;

/*
 * @title LibraryDemo & string library for Solidity contracts.
 * This is a extended library where all the string utility finctions are added and can be inviked in the project.
 * @dev Functionality in this library is to count the lenght of the string
 */
library LibraryDemo {

    /** @dev To find the length of a string passed. It will work for UTF-8 chars as well
    *   @param str input string
    *   @return length length of the string.
    */
    function utfStringLength(string str) 
    public 
    pure
    returns (uint length)
    {
        uint i = 0;
        bytes memory string_rep = bytes(str);

        while (i<string_rep.length)
        {
            if (string_rep[i]>>7==0)
                i += 1;
            else if (string_rep[i]>>5==0x6)
                i += 2;
            else if (string_rep[i]>>4==0xE)
                i += 3;
            else if (string_rep[i]>>3==0x1E)
                i += 4;
            else
                //For safety
                i += 1;

            length++;
        }
    }
}