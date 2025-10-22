cmake_minimum_required(VERSION 4.2)
project(Aeris)

find_package(cpr REQUIRED)
add_executable(Aeris Aeris.cpp)
target_link_libraries(Aeris PRIVATE cpr::cpr)
add_subdirectory(cpp-dotenv)
target_link_libraries(Aeris PRIVATE cpp_dotenv)
