using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_02_24T20_16 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_server_types_server_type_id",
                table: "servers");

            migrationBuilder.DropPrimaryKey(
                name: "pk_server_types",
                table: "server_types");

            migrationBuilder.RenameTable(
                name: "server_types",
                newName: "system_types");

            migrationBuilder.RenameColumn(
                name: "ip",
                table: "servers",
                newName: "ip_address");

            migrationBuilder.RenameColumn(
                name: "ip",
                table: "proxies",
                newName: "ip_address");

            migrationBuilder.AddColumn<DateTime>(
                name: "date_created",
                table: "servers",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "date_created",
                table: "proxies",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "date_created",
                table: "identities",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "pk_system_types",
                table: "system_types",
                column: "id");

            migrationBuilder.UpdateData(
                table: "identities",
                keyColumn: "id",
                keyValue: 1L,
                column: "date_created",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "proxies",
                keyColumn: "id",
                keyValue: 1L,
                column: "date_created",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "fk_servers_system_types_server_type_id",
                table: "servers",
                column: "server_type_id",
                principalTable: "system_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_system_types_server_type_id",
                table: "servers");

            migrationBuilder.DropPrimaryKey(
                name: "pk_system_types",
                table: "system_types");

            migrationBuilder.DropColumn(
                name: "date_created",
                table: "servers");

            migrationBuilder.DropColumn(
                name: "date_created",
                table: "proxies");

            migrationBuilder.DropColumn(
                name: "date_created",
                table: "identities");

            migrationBuilder.RenameTable(
                name: "system_types",
                newName: "server_types");

            migrationBuilder.RenameColumn(
                name: "ip_address",
                table: "servers",
                newName: "ip");

            migrationBuilder.RenameColumn(
                name: "ip_address",
                table: "proxies",
                newName: "ip");

            migrationBuilder.AddPrimaryKey(
                name: "pk_server_types",
                table: "server_types",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_server_types_server_type_id",
                table: "servers",
                column: "server_type_id",
                principalTable: "server_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
